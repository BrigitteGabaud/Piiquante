"use strict";
/* Import des dépendances */
const jwt = require('jsonwebtoken');

/* Middleware d'authentification */
module.exports = (req, res, next) => {
    try {
        /* Récupère le token */
        const token = req.headers.authorization.split(' ')[1]; // split autour espace entre 'bearer' et token dans le header et récupère le 2eme élément: token
        /* Décode le token et crée un objet JS */
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY_JWT);
        /* Récupère le userId contenu dans l'objet JS créé */
        const userId = decodedToken.userId;
        /* Vérifie s'il y a un userId dans requête qu'il correspond à celui du token */
        if(req.body.userId, req.body.userId ==! userId) { // si différent: retourne erreur
            throw 'User ID non valable !';
        } else {
            // Récupère le user du token
            req.user = decodedToken;
            next(); // si tout est ok, passe req au prochain middl
        }
    } catch (error) {
        res.status(401).json({ error: error } | 'Requête non authentifiée !')
    }
}