const graph = require('../graph')

module.exports = {
    getUser: async (req, res, next) => {
        //console.log(`response data: ${util.inspect(res, {showHidden: false, depth: null})}`)
        
        let userInfo = await graph.getUserDetails(req.session.accessToken)

        let params = {
            active: { home: true },
            user: req.user ? req.user : null,
            info: userInfo,
        };

        res.render('profile', params);
    }
}