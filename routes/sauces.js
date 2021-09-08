const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');

/* Route Post: crée une nouvelle sauce*/
router.post('/', sauceCtrl.createSauce);

/* Route Put: modifie une sauce*/
router.put('/:id', sauceCtrl.modifySauce);

/* Route Delete: supprime une sauce*/
router.delete('/:id', sauceCtrl.deleteSauce);

/* Route Get: renvoie une seule sauce grâce à la méthode findOne et l'objet de comparaison*/
router.get('/:id', sauceCtrl.getOneSauce);

/* Route Get: renvoie toutes les sauces dans la base de données */
router.get('/', sauceCtrl.getAllSauces);

module.exports = router; 