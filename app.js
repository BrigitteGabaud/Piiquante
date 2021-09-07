const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Sauce = require('./models/sauces');


mongoose.connect("mongodb+srv://Bri:BriexoOC@clustersopekocko.stgj0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Middleware headers général */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* Transforme le corps de la requête en objet javascript */
app.use(express.json());

/* Requête création nouvelle sauce*/
app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
});

/* Route Get: renvoie une seule sauce grâce à la méthode findOne et l'objet de comparaison*/
app.get('/api/sauces/:id', (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
})

/* Route Get: renvoie toutes les sauces dans la base de données */
app.get('/api/sauces', (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  });

module.exports = app;