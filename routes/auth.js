//const graph = require('../graph');
const express = require('express');
const passport = require('passport');
const router = express.Router();

/* GET auth callback. */
router.get('/signin',
  function  (req, res, next) {
    //console.log(res)
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        //customState: 'my_state',          
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  function(req, res) {
    console.log('Login was called in the Sample');
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
    req.session.timeStamp = Date.now()
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