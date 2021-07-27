const express = require('express');
const router = express.Router();
const userCtrlr = require('../controllers/users_ctrlr')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

/* GET users listing. */
router.get('/', ensureAuth, userCtrlr.getUser)

module.exports = router;
