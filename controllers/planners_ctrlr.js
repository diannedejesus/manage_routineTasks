const graph = require('../graph')
const refreshAccessToken =  require('../bin/refreshToken');

module.exports = {
    getIndex: async (req, res, next) => {
        //console.log(req.user ? req.user.profile : null)
        let userGroups
        //let revisions = []

        if(req.user){
            userGroups = await graph.getUserPlanners(req.user.accessToken, req.user.microsoftId)
            
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
        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
        };
        res.render('searching', params);
    },

    startSearch: async (req, res, next) => {
        const timeElapsed = Math.floor((Date.now() - req.session.timeStamp) /1000)
console.log(timeElapsed)
        if(timeElapsed > 3500){
            console.log('timed refresh')
            try{
                //req.user.accessToken = await refreshAccessToken.getJSON(req.user.accessToken)
                console.log(await refreshAccessToken.getJSON(req.user.accessToken))
            }catch (error){
                console.log(error)
            }  //TODO check if works ///have the new token plugged in after using the refresh

            //console.log(req.user.accessToken)
            //req.session.timeStamp = Date.now()
        } 

        console.log(req.user.accessToken ? true : false)
        searchResults = await graph.searchAllPlanners(req.user.accessToken, req.user.microsoftId, req.body.searchTerm)
        //if not search result the get token try again
        console.log('searchresult: ', searchResults)
        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isSearch: true,
            searchResults: searchResults,
        };
        res.render('searching', params);
    }
}