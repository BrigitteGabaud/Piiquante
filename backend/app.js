"use strict";
/* Import des dépendances */
require('dotenv').config()
const express = require('express'); // framework
const mongoose = require('mongoose');
const path = require('path'); // donne accès au chemin de syst de fichiers
const helmet = require('helmet');

/* Import routers */
const saucesRoutes = require('./routes/sauces');
const usersRoutes = require('./routes/user');

/* Connexion base de données */
mongoose.connect(process.env.DB_LINK, // renvoie vers le fichier .env cont lien connex
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Crée application express */
const app = express();

/* Configuration headers appliquée à toutes les routes (CORS)  */
/* Permet au front-end d'accéder à l'API */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // =  ok accès à tout le monde
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // = ok utilisation headers sur obj req
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// = ok utilisation verbes requête
    next();
});

/* Fonction ajoutant sécurité dans les headers */
app.use(helmet());

/* Fonction transformant le corps de la requête en objet javascript */
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

/* Fonction récupèrant image dans dossier image pour envoyer vers frontend */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* Enregistrement routers */
app.use('/api/sauces', saucesRoutes);// 1er fragment route
app.use('/api/auth', usersRoutes);

/*Exporte application et la rend dispo dans les autres fichiers */
module.exports = app;