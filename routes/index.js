const express = require('express');
const router = express.Router();
//require('isomorphic-fetch');


/* GET home page. */
router.get('/', async function(req, res, next) {
  let params = {
    active: { home: true },
    user: req.user ? req.user.profile : null
  };
//console.log(res)
  res.render('index', params);
});


module.exports = router;