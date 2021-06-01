const graph = require('../graph')

module.exports = {
    getIndex: async (req, res, next) => {
        //console.log(req.user ? req.user.profile : null)
        let userGroups

        if(req.user){
            userGroups = await graph.getUserPlanners(req.user.accessToken, req.user.profile.oid)
            
            //console.log(await graph.searchAllPlanners(req.user.accessToken, req.user.profile.oid, 'Wa'))
        }

        let params = {
            isPlanner: true,
            items: userGroups
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

        console.log(title.title)

        let params = {
            isSingleTask: true,
            title: title.title,
            items: tasks
        };
        res.render('calendar', params);
    }
}