const express = require('express');
const passport = require('passport');
const router = express.Router();

/* GET auth callback. */
router.get('/signin',
  function  (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,         
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  function(req, res) {
    console.log('Signin was called');
    res.redirect('/');
  }
);

router.post('/callback',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  async function(req, res) {
    console.log('We received a return from AzureAD.');

    //create some custom session variables for handling the refreshing of the access token
    req.session.timeStamp = Date.now() //time stamp is for checking whether we need to update the access token, since this is when we first login the user we initialize this variable
    req.session.accessToken = res.req.user.accessToken //store current access token recieved by the login, to the current session
    req.session.refreshToken = res.req.user.refreshToken //store the current refresh token recieved by the login, to the current session

    req.session.save(function(err) { //save the session so the added data is saved to the cookie and our session data in the database
      err ? console.log('session saved') : console.log(err)
    })

    res.redirect('/');
  }
);

router.get('/signout',
  function(req, res) {
    req.session.destroy(function(err) {
      req.logout();
      res.redirect('/');
    });
  }
);

module.exports = router;