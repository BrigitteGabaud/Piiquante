const express = require('express');
const router = express.Router();


const Sauce = require('../models/sauces');

/* Route Post: crée une nouvelle sauce*/
router.post('/', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
});

/* Route Put: modifie une sauce*/
router.put('/:id', (req, res, next) => {
    Sauce.updateOne({_id: req.params.id }, {...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
})

/* Route Delete: supprime une sauce*/
router.delete('/:id', (req, res, next) => {
    Sauce.deleteOne({_id: req.params.body})
    .then(() => res.status(200).json({ message:'Sauce supprimée !'}))
    .catch(error => res.status(404).json({ error }));
})

/* Route Get: renvoie une seule sauce grâce à la méthode findOne et l'objet de comparaison*/
router.get('/:id', (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
})

/* Route Get: renvoie toutes les sauces dans la base de données */
router.get('/', (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  });

  module.exports = router; 