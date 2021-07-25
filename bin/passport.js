const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
//const mongoose = require('mongoose')
const User = require('../models/User')  //used to store user data in mongo database

module.exports = function (passport) {
  // Configure OIDC strategy
  passport.use(
    new OIDCStrategy({
      identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
      clientID: process.env.OAUTH_APP_ID,
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: process.env.OAUTH_REDIRECT_URI,
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.OAUTH_APP_PASSWORD,
      validateIssuer: false,
      passReqToCallback: false,
      scope: process.env.OAUTH_SCOPES.split(' ')
    },
    signInComplete
  ));

  // Callback function called once the sign-in is complete
  // and an access token has been obtained
  async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
    if (!profile.oid) {
      return done(new Error("No OID found in user profile."), null);
    }

      const newUser = { //store user database recieved by microsoft authentication
        microsoftId: profile.oid,
        displayName: profile.displayName,
      }

      try {
        let user = await User.findOne( { microsoftId: profile.oid }) //verify if the user is already in our database

        if (user) {
          console.log('user found')

          //when using an api to access data from microsoft we need to present and access token so we store it temporarily in the
          //user object. This token expires after a specified amount of time, to renew it we need to send the refresh token. So
          //we also temporarily store it in the user object.
          user.accessToken = accessToken
          user.refreshToken = refreshToken

          done(null, user) //passes the user object to the next phase which will be the auth route callback
        } else {
          user = await User.create(newUser) //create a new user in our database

          //when using an api to access data from microsoft we need to present and access token so we store it temporarily in the
          //user object. This token expires after a specified amount of time, to renew it we need to send the refresh token. So
          //we also temporarily store it in the user object.
          user.accessToken = accessToken
          user.refreshToken = refreshToken
          
          console.log('created user')
          done(null, user) //passes the user object to the next phase which will be the auth route callback
        }

      } catch (err) {
        console.error(err)
      }
  }

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })

}





