const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

/* Route post: création compte */
router.post('/signup', userCtrl.signup);

/* Route post: authentification */
router.post('/login', userCtrl.login);

module.exports = router;