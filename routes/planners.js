const express = require('express');
const router = express.Router();
//const graph = require('../graph')
const plannersCtrlr = require('../controllers/planners_ctrlr')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

/* GET users listing. */
router.get('/', ensureAuth, plannersCtrlr.getIndex)

router.get('/getTasks', ensureAuth, plannersCtrlr.getTasks)

router.get('/getSingleTask', ensureAuth, plannersCtrlr.getSingleTask)

router.get('/search', ensureAuth, plannersCtrlr.getSearch)

router.post('/startSearch', ensureAuth, plannersCtrlr.startSearch)

module.exports = router;
