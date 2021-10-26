/* Import des dépendances */
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require("express-rate-limit");

/* Fonction limitation requêtes création compte */
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure de temps
  max: 5, // Bloque à partir de 5 requêtes
  message:
    "Trop de comptes créés à partir de cette adresse IP, veuillez réessayer d'ici une heure."
});

/* Route post: création compte */
router.post('/signup',createAccountLimiter, userCtrl.signup);

/* Route post: authentification */
router.post('/login', userCtrl.login);

module.exports = router;