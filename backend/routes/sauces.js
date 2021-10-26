"use strict";
/* Import des dépendances */
const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* Route Post: crée une nouvelle sauce*/
router.post('/', auth, multer, sauceCtrl.createSauce);

/* Route Post: renvoie un like ajouté pour une sauce */
router.post('/:id/like', auth, sauceCtrl.isItLiked); 

/* Route Get: renvoie toutes les sauces dans la base de données */
router.get('/', auth, sauceCtrl.getAllSauces);

/* Route Get: renvoie une seule sauce grâce à la méthode findOne et l'objet de comparaison*/
router.get('/:id', auth, sauceCtrl.getOneSauce);

/* Route Put: modifie une sauce*/
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

/* Route Delete: supprime une sauce*/
router.delete('/:id', auth, sauceCtrl.deleteSauce);


module.exports = router; 