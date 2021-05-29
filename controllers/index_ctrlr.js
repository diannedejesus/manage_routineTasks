const graph = require('../graph')

module.exports = {
    getIndex: async (req, res, next) => {
        let params = {
            active: { home: true },
            user: req.user ? req.user.profile : null
        };
        res.render('index', params);
    }
}