const graph = require('../graph')
const refreshAccessToken =  require('../bin/refreshToken');

module.exports = {
    getIndex: async (req, res, next) => {
        //console.log(req.user ? req.user.profile : null)
        let userGroups
        //let revisions = []

        if(req.user){
            userGroups = await graph.getUserPlanners(req.session.accessToken, req.user.microsoftId)
            
            userGroups.forEach(element => console.log(element.planner))
            //console.log('length: ', userGroups)
            // console.log(userGroups.filter(el => {
            //     if(el.title){
            //         return el.title.toLowerCase().includes('revision')
            //     }
            // }))
            // for(let i=userGroups.length; i >= 0; i--){
                
            // }
        }

        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isPlanner: true,
            items: userGroups,
            //revisions: revision,
        };
        res.render('planner', params);
    },

    getTasks: async (req, res, next)=> {
        let tasks
        //console.log(Object.keys(req.query))
        try {
            tasks = await graph.getAllTasks(req.session.accessToken, Object.keys(req.query))
        } catch (error) {
            console.log(error); // TypeError: failed to fetch
        }
        
        console.log(tasks)
        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isTask: true,
            items: tasks
        };
        res.render('planner', params);
    },

    getSingleTask: async (req, res, next) => {
        let tasks
        let title

        try {
            tasks = await graph.getDetailedTask(req.session.accessToken, Object.keys(req.query))
            title = await graph.getTaskTitle(req.session.accessToken, Object.keys(req.query))
        } catch (error) {
            console.log(error); // TypeError: failed to fetch
        }

        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isSingleTask: true,
            title: title.title,
            items: tasks
        };
        res.render('planner', params);
    },

    getSearch: async (req, res, next) => {
        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
        };
        res.render('searching', params);
    },

    startSearch: async (req, res, next) => {
        searchResults = await graph.searchAllPlanners(req.session.accessToken, req.user.microsoftId, req.body.searchTerm)

        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isSearch: true,
            searchResults: searchResults,
        };
        res.render('searching', params);
    },

    getTemplate: async (req, res, next) => {
        let userGroups


        if(req.user){
            userGroups = await graph.getAllGroups(req.session.accessToken, req.user.microsoftId)
            //console.log(userGroups)
            //userGroups.forEach(element => console.log(element.planner))
            //console.log('length: ', userGroups)
            // console.log(userGroups.filter(el => {
            //     if(el.title){
            //         return el.title.toLowerCase().includes('revision')
            //     }
            // }))
            // for(let i=userGroups.length; i >= 0; i--){
                
            // }
        }

        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isPlanner: true,
            items: userGroups,
        };
        res.render('template', params);
    },

    createTemplate: async (req, res, next) => {
        //Need to specify the group first use like searchterm
        const planName = 'Revision Mes'
        const bucketName = 'Current Tasks'
        const taskName = 'Test task'
        const checklistNames = ['Form Booklet', 'Form Low Income', 'Civil status', 'Form System Permision', 'Water certification', 'Electricity certification']
        
        //create a plan --- accessToken, groupId, planTitle
        const createdPlan = await graph.createPlan(req.session.accessToken, Object.keys(req.query)[0], planName)
        
        //create buckets --- accessToken, bucketName, planId
        const createdBucket = await graph.createBucket(req.session.accessToken, bucketName, createdPlan.id)
        
        //create task --- accessToken, title, planId, bucketId, assignments = {}
        const createdTask = await graph.createTask(req.session.accessToken, taskName, createdPlan.id, createdBucket.id)
        
        //getDetailedTask: getTasks(accessToken, taskID)
        const createdTaskDetails =  await graph.getDetailedTask(req.session.accessToken, createdTask.id)

        //update task to add checklist --- accessToken, taskID
        const updatedTask = await graph.updateDetailedTask(req.session.accessToken, createdTask.id, createdTaskDetails['@odata.etag'], checklistNames)
        
        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isCreated: true,
        };
        res.render('template', params);
    }
}