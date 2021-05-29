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
            active: { home: true },
            user: req.user ? req.user.profile : null,
            planner: userGroups
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
            active: { home: true },
            user: req.user ? req.user.profile : null,
            planner: tasks
        };
        res.render('calendar', params);
    }
}