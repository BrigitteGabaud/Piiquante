"use strict";
/* Import des dépendances */
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require('../middleware/rateLimit');

/* Route post: création compte */
router.post('/signup', rateLimit.Limiter, userCtrl.signup);

/* Route post: authentification */
router.post('/login', rateLimit.Limiter, userCtrl.login);

module.exports = router;