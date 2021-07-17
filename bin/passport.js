const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const mongoose = require('mongoose')
require('dotenv').config();
const User = require('../models/User')

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

    //TODO: HOW TO STORE ACCESSTOKEN IN SESSION INSTEAD
      const newUser = {
        microsoftId: profile.oid,
        displayName: profile.displayName,
        accessToken: accessToken
      }

      try {
        let user = await User.findOneAndUpdate( { microsoftId: profile.oid, accessToken: accessToken })
  
        if (user) {
          console.log('user found')
          done(null, user)
        } else {
          user = await User.create(newUser)
          console.log('created user')
          done(null, user)
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





