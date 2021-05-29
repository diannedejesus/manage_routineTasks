const express = require('express');
const router = express.Router();
const indexCtrlr = require('../controllers/index_ctrlr')


/* GET home page. */
router.get('/', indexCtrlr.getIndex)

module.exports = router;