const jwt = require('jsonwebtoken');

/* Middleware d'authentification */
module.exports = (req, res, next) => {
    try {
        /* Récupère le token */
        const token = req.headers.authorization.split(' ')[1];
        /* Décode le token */
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        /* Récupère le userId contenu dans l'objet JS créé */
        const userId = decodedToken.userId;
        /* Vérifie s'il y a un userId qu'il correspond au token */
        if(req.body.userId, req.body.userId ==! userId) {
            throw 'User ID non valable !';
        } else {
            // Récupère le user du token
            req.user = decodedToken;
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error} | 'Requête non authentifiée !')
    }
}