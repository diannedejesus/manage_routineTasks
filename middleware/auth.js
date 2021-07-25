//const util = require('util')
const refreshAccessToken =  require('../bin/refreshToken');

module.exports = {
    ensureAuth: async function (req, res, next) {
      if (req.isAuthenticated()) {
        
        const timeElapsed = Math.floor((Date.now() - req.session.timeStamp) /1000) //calculate how much time has elapsed since recieving or refreshing the access token
        console.log('verified time: ', timeElapsed)

        if(timeElapsed > 3500){  //when to refresh the token, the current time limit is 3599s about 59min this time is return with the token and probably should be used from there but I choose to hard code it.
          console.log('timed token refresh')
          try{
              let tokenInfo = await refreshAccessToken.getJSON(req.session.refreshToken) //module that uses the refresh token to get a new access token it returns an object with the needed data
              req.session.accessToken = tokenInfo.access_token //update the sessions current access token 
              req.session.refreshToken = tokenInfo.refresh_token //update the sessions current refresh token

              req.session.save(function(err){ //save the session so the added data is saved to the cookie and our session data in the database
                  console.log('saved:', err)
                  req.session.timeStamp = Date.now() //if saved correctly then update the timestamp
              })
          }catch (error){
              console.log(error)
          }
        }

        return next()
      } else {
        res.redirect('/')
      }
    },

    ensureGuest: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      } else {
        res.redirect('/');
      }
    },
}