const graph = require('../graph')
const refreshAccessToken =  require('../bin/refreshToken');

module.exports = {
    getIndex: async (req, res, next) => {
        let userPlans

        if(req.user){
            try {
                userPlans = await graph.getUserPlanners(req.session.accessToken, req.user.microsoftId)
            } catch (error) {
                console.log(error);
            }
        }

        const params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isPlanner: userPlans ? true : false,
            items: userPlans,
        };

        res.render('planner', params);
    },

    getTasks: async (req, res, next)=> {
        let tasks

        try {
           tasks = await graph.getAllTasks(req.session.accessToken, Object.keys(req.query))
           console.log(tasks)
        } catch (error) {
            console.log(error);
        }
        
        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isTask: tasks ? true : false,
            items: tasks,
        };

        res.json( tasks )
        //res.render('planner', params);
    },

    getSingleTask: async (req, res, next) => {
        let tasks
        let title

        try {
            tasks = await graph.getDetailedTask(req.session.accessToken, Object.keys(req.query))
            title = await graph.getTaskTitle(req.session.accessToken, Object.keys(req.query))
        } catch (error) {
            console.log(error);
        }

        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isSingleTask: true,
            title: title.title,
            items: tasks
        };

        res.json( tasks )
        //res.render('planner', params);
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
            try {
                userGroups = await graph.getAllGroups(req.session.accessToken, req.user.microsoftId)
            } catch (error) {
                console.log(error);
            }
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
        const planName = 'Plan Name'
        const packetBucket = 'Packet'
        let taskList = req.body.nameList
        const taskName = ' - Packet'
        const packetChecklist = ['Form Booklet', 'Form Low Income', 'Civil status', 'Form System Permision', 'Water certification', 'Electricity certification']
        console.log(req)
        //create a plan --- accessToken, groupId, planTitle
        const createdPlan = await graph.createPlan(req.session.accessToken, req.body.groupId, planName)
        
        //create buckets --- accessToken, bucketName, planId
        const createdBucket = await graph.createBucket(req.session.accessToken, packetBucket, createdPlan.id)

        taskList = taskList.split(',')
        taskList = taskList.foreach(el => el.trim())
        
        //tasklist
        for(items of taskList){
            //create task --- accessToken, title, planId, bucketId, assignments = {}
            let createdTask = await graph.createTask(req.session.accessToken, items + taskName, createdPlan.id, createdBucket.id)
        
            //getDetailedTask: getTasks(accessToken, taskID)
            let createdTaskDetails =  await graph.getDetailedTask(req.session.accessToken, createdTask.id)

            //update task to add checklist --- accessToken, taskID
            let updatedTask = await graph.updateDetailedTask(req.session.accessToken, createdTask.id, createdTaskDetails['@odata.etag'], packetChecklist)
        }

        // //create task --- accessToken, title, planId, bucketId, assignments = {}
        // const createdTask = await graph.createTask(req.session.accessToken, taskName, createdPlan.id, createdBucket.id)
        
        // //getDetailedTask: getTasks(accessToken, taskID)
        // const createdTaskDetails =  await graph.getDetailedTask(req.session.accessToken, createdTask.id)

        // //update task to add checklist --- accessToken, taskID
        // const updatedTask = await graph.updateDetailedTask(req.session.accessToken, createdTask.id, createdTaskDetails['@odata.etag'], packetChecklist)
        
        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isCreated: true,
        };
        res.render('template', params);
    }
}