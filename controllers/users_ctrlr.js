const graph = require('../graph')

module.exports = {
    getUser: async (req, res, next) => {
        //console.log(`response data: ${util.inspect(res, {showHidden: false, depth: null})}`)
        let userInfo = await graph.getUserDetails(req.user.accessToken)
        //console.log(userInfo)
        res.send(`Hi ${userInfo.displayName}, your registered email is ${userInfo.mail}`);
    }
}