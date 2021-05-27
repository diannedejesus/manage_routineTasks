//const util = require('util')

module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        ////console.log(`request data: ${util.inspect(req, {showHidden: false, depth: null})}`)
        //console.log(`response data: ${util.inspect(res, {showHidden: false, depth: null})}`)
        return next()
      } else {
        res.redirect('/')
      }
    },
    ensureGuest: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      } else {
        res.redirect('/dashboard');
      }
    },
  }
  