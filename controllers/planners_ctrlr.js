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
        //console.log('Elapsed Time: ', timeElapsed)
        if(timeElapsed > 3500){
            console.log('timed token refresh')
            try{
                let tokenInfo = await refreshAccessToken.getJSON(req.session.refreshToken)
                req.session.accessToken = tokenInfo.access_token
                req.session.refreshToken = tokenInfo.refresh_token

                req.session.save(function(err){
                    console.log('saved:', err)
                    req.session.timeStamp = Date.now()
                });
            }catch (error){
                console.log(error)
            }
        } 

        //console.log(req.session)
        searchResults = await graph.searchAllPlanners(req.session.accessToken, req.user.microsoftId, req.body.searchTerm)
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