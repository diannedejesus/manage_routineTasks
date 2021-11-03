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
        const planName = req.body.planName === '' ? "No Name" : req.body.planName
        const packetBucket = 'Participant Documents'
        let taskList = req.body.nameList.split(',')
        const taskName = ' - Documents'
        const packetChecklist = [
            'Desempleo',
            'Antecedente Penal',
            'ASUME',
            'PAN/TANF',
            'Ofensores Sexuales',
            'Utilidades',
            'Libreto de Revision',
            'Ingresos Limitado',
            'Estado Civil',
           ' Notificacion EIV',
            'AAA',
            'AEE',
            'Empleo',
            'Otros Ingresos (ayuda familiar, acuerdo mutuo, negocio propio, ect.)',
            'Estado Bancario',
            'ID'
        ]
        const documentNotes = 
        `
        Desempleo: https://desempleo.trabajo.pr.gov/UICertificate/Language.aspx
        Antecedente Penal: https://servicios.pr.gov/info
        ASUME: https://app.asume.pr.gov/Individuals
        PAN/TANF: https://servicios.adsef.pr.gov/views/certServicio.aspx

        Ofensores Sexuales:
        https://www.nsopw.gov/
        http://sor.pr.gov/
        https://municipiodegurabo.sharepoint.com/:b:/s/Section8/EYIamtx9-lVAvCiyC78djysBTCGkqBrJzUu-BEo5KIdESA?e=voIqZu

        Utilidades:
        https://municipiodegurabo.sharepoint.com/:b:/s/Section8/EXhZliQ1titHlhlEcF4HFOQB7mymz5Y77A3rfq8lhP7-lg?e=FZb3f9
        `
//console.log(req)
        //create a plan --- accessToken, groupId, planTitle
        const createdPlan = await graph.createPlan(req.session.accessToken, req.body.groupId, planName)
        
        //create buckets --- accessToken, bucketName, planId
        const createdBucket = await graph.createBucket(req.session.accessToken, packetBucket, createdPlan.id)

        taskList.forEach(el => el.trim())
        
        //tasklist
        for(items of taskList){
            //create task --- accessToken, title, planId, bucketId, assignments = {}
            let createdTask = await graph.createTask(req.session.accessToken, items + taskName, createdPlan.id, createdBucket.id)
        
            //getDetailedTask: getTasks(accessToken, taskID)
            let createdTaskDetails =  await graph.getDetailedTask(req.session.accessToken, createdTask.id)

            //update task to add checklist --- accessToken, taskID
            let updatedTask = await graph.updateDetailedTask(req.session.accessToken, createdTask.id, createdTaskDetails['@odata.etag'], packetChecklist, documentNotes)
        }
        
        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            isCreated: true,
        };
        res.render('template', params);
    }
}