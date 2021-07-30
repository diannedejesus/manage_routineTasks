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
    }
}