"use strict";
/* Import dépendances */
const bcrypt = require('bcrypt'); // package hash password
const jwt = require('jsonwebtoken'); // package génération + vérif token
const schemaAuth = require('../schema/schemaAuth')

/* Import modele sauce */
const User = require('../models/User');

/* Export de la fonction inscription */
exports.signup =  (req, res, next)=> {
        schemaAuth.validateAsync(req.body)
        .then(() => {
            /* cherche user dans db par son ad mail */
            return User.findOne({email: req.body.email}) 
        })
        .catch(error => res.status(400).json({ error }))
    
    /* vérifie si elle est unique*/
    .then(user => {
        if(user) {
            return  res.status(403).json({ error: 'Adresse mail déjà enregistrée.'})};
    })
    /* Hache le mot de passe 10x */    
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        /* création utilisateur */
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save() // enregistrement utilisateur dans db
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
    })
    .catch(error => res.status(500).json({ error })); 
};

/* Export de la fonction authentification */
exports.login = (req, res, next)=> {
    schemaAuth.validateAsync(req.body)
        .then(() => {
            /* cherche user dans db par son ad mail */
            return User.findOne({email: req.body.email}) 
        })
        .catch(error => res.status(400).json({ error }))
    
    /* vérifie si elle est unique*/
    .then(user => {
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'}); 
        }
        /* Compare mdp req à celui db */
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'});
            }
            res.status(200).json({
                /* Renvoie obj json avec user id + token et confirm authentification */
                userId: user._id,
                token: jwt.sign( // appel fonction jwt
                    { userId: user._id }, // 1er arg = "paylod" avec données à encoder
                    process.env.SECRET_KEY_JWT, // 2e arg = clé secrète pour encodage
                    { expiresIn: '24h'} // 3e arg config delai expiration token
                )
            });
        }) 
        .catch(error => res.status(500).json({ message: error.message}));
    })
    .catch(error => res.status(500).json({ message: error.message }))
};