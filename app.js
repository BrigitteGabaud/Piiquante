const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const usersRoutes = require('./routes/user');

mongoose.connect("mongodb+srv://Bri:BriexoOC@clustersopekocko.stgj0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

/* Middleware headers général */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* Transforme le corps de la requête en objet javascript */
app.use(express.json());

/* Indique à app quel fichier image (static) servir à l'aide de path pour accéder au chemin */
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', usersRoutes);

module.exports = app;