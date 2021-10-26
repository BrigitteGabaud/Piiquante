"use strict";
/* Import des dépendances */
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

const saucesRoutes = require('./routes/sauces');
const usersRoutes = require('./routes/user');

/* Connexion base de données */
mongoose.connect(process.env.DB_LINK,
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

/* Ajoute de la sécurité dans les headers */
app.use(helmet());

/* Transforme le corps de la requête en objet javascript */
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

/* Récupère l'image dans dossier image pour envoyer vers frontend */
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', usersRoutes);

module.exports = app;