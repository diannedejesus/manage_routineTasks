//const util = require('util')
const express = require('express');
const router = express.Router();
const graph = require('../graph')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

/* GET users listing. */
router.get('/', ensureAuth, async function(req, res, next) {
  //console.log(`response data: ${util.inspect(res, {showHidden: false, depth: null})}`)
  console.log(await graph.getUserDetails(req.user.accessToken))
  res.send('respond with a resource');
});

module.exports = router;
