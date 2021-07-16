const graph = require('../graph')

module.exports = {
    getIndex: async (req, res, next) => {
        //console.log(req.user ? req.user.profile : null)
        let userGroups
        //let revisions = []

        if(req.user){
            userGroups = await graph.getUserPlanners(req.user.accessToken, req.user.profile.oid)
            
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
            isPlanner: true,
            items: userGroups,
            //revisions: revision,
        };
        res.render('calendar', params);
    },

    getTasks: async (req, res, next)=> {
        let tasks
        //console.log(Object.keys(req.query))
        try {
            tasks = await graph.getAllTasks(req.user.accessToken, Object.keys(req.query))
        } catch (error) {
            console.log(error); // TypeError: failed to fetch
        }
        
        console.log(tasks)
        let params = {
            isTask: true,
            items: tasks
        };
        res.render('calendar', params);
    },

    getSingleTask: async (req, res, next) => {
        let tasks
        let title
        //console.log(Object.keys(req.query))
        try {
            tasks = await graph.getDetailedTask(req.user.accessToken, Object.keys(req.query))
            title = await graph.getTaskTitle(req.user.accessToken, Object.keys(req.query))
        } catch (error) {
            console.log(error); // TypeError: failed to fetch
        }

        let params = {
            isSingleTask: true,
            title: title.title,
            items: tasks
        };
        res.render('calendar', params);
    },

    getSearch: async (req, res, next) => {
        res.render('searching');
    },

    startSearch: async (req, res, next) => {
        
        searchResults = await graph.searchAllPlanners(req.user.accessToken, req.user.profile.oid, req.body.searchTerm)
        nickName = req.user.profile._json.preferred_username.split('@')[1].split('.')[0]

        let params = {
            isSearch: true,
            searchResults: searchResults,
            msNick: nickName
        };
        res.render('searching', params);
    }
}