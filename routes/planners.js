const express = require('express');
const router = express.Router();
const plannersCtrlr = require('../controllers/planners_ctrlr')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

/* GET users listing. */
router.get('/', ensureAuth, plannersCtrlr.getIndex)

router.get('/getTasks', ensureAuth, plannersCtrlr.getTasks)

router.get('/getSingleTask', ensureAuth, plannersCtrlr.getSingleTask)

router.get('/search', ensureAuth, plannersCtrlr.getSearch)

router.post('/startSearch', ensureAuth, plannersCtrlr.startSearch)

router.get('/template', ensureAuth, plannersCtrlr.getTemplate)

router.get('/createTemplate', ensureAuth, plannersCtrlr.createTemplate)
router.post('/createTemplate', ensureAuth, plannersCtrlr.createTemplate)

module.exports = router;