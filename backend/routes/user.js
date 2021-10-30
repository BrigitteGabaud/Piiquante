"use strict";
/* Import des dépendances  et fonctions */
const express = require('express');
const router = express.Router(); // création router = usage "router." et non "app."
const userCtrl = require('../controllers/user'); // import controller
const rateLimit = require('../middleware/rateLimit');

/* Route post: création compte */
router.post('/signup', rateLimit.Limiter, userCtrl.signup); // 2e fragment route

/* Route post: authentification */
router.post('/login', rateLimit.Limiter, userCtrl.login);

module.exports = router;