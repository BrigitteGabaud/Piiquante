const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

/* Export de la fonction inscription */
exports.signup = (req, res, next)=> {
    User.findOne({email: req.body.email})
    /* Recherche l'adresse mail envoyée et vérifie si elle est unique*/
    .then(user => {
        if(user) {
            return  res.status(403).json({ error: 'Adresse mail déjà enregistrée.'})};
        })
    /* Hache le mot de pase*/    
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
    })
   
    .catch(error => res.status(500).json({ error }));
};

/* Export de la fonction authentification */
exports.login = (req, res, next)=> {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h'}
                )
            });
        }) 
        .catch(error => res.status(500).json({ message: error.message}));
    })
    .catch(error => res.status(500).json({ message: error.message }))
};