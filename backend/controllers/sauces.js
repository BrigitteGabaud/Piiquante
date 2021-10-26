"use strict";
const Sauce = require('../models/sauces');
/* donne accès aux opérations liées aux syst de fichiers */
const fs = require('fs'); 
const User = require('../models/User');


/* Export de la fonction création Sauce (POST) */
exports.createSauce = (req, res, next) => {
    /* Convertit chaîne caractères (= objet js) du corps requête 'req.body.sauce' en objet json extrait du 'sauce' */
    const sauceObject = JSON.parse(req.body.sauce);
    /* Supprime id de sauceObject */
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, 
        /* Génère url image = protocole + nom hôte + 'image' + nom fichier */
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
       
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error })); 
}

/* Export de la fonction récupération une sauce */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

/* Export de la fonction récupération de toutes les sauces */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

/* Export de la fonction modification sauce */
exports.modifySauce = (req, res, next) => {
    // Récupère l'id de l'utilisateur effectuant la requête
    const reqUserId = req.user.userId;

    // Cherche la sauce concernée dans la BDD 
    Sauce.findOne({_id:req.params.id}) 
    .then(sauceResponse => {
        // Si l'userId de la BDD correspond à celui de la requête
        if(sauceResponse.userId == reqUserId ) {

            // l'image est modifiée
            /* Y a t-il une requête pour un fichier image ? */
            const sauceObject = req.file ?
            {
            // Récupère toutes les informations de la sauce
            ...JSON.parse(req.body.sauce), 
            // Génère l'image url
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            // = Si req.file n'existe pas: on prend le corps de la requête
            } : { ...req.body}; 
            // modifie l'identifiant de l'objet créé
            Sauce.updateOne({_id: req.params.id }, {...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
            .catch(error => res.status(400).json({ error }));
        } else {
            // Sinon envoie un message d'erreur et arrête le code (return)
            return res.status(403).json({message:  `403: unauthorized request `})
        }
            
    })
    .catch(error => res.status(404).json({ error }))
}

/* Export de la fonction suppression sauce */
exports.deleteSauce = (req, res, next) => {
    const reqUserId = req.user.userId;

    Sauce.findOne({_id:req.params.id}) 
    .then(sauceResponse => {

        // Si l'userId de la BDD correspond à celui de la requête
        if(sauceResponse.userId == reqUserId ) {
             
            // La sauce est supprimée
            /* Accède à l'objet pour récup url image + nom fichier */
            Sauce.findOne({_id: req.params.id})
            /* callback récupère sauce + nom exact fichier */
            .then(sauce => {
                /* Extrait nom du fichier à suppr :Récupère imageUrl sauce retournée / base + split autour '/images/' et retourne tableau de 2 elmts avant/ après /images/ */
                const filename = sauce.imageUrl.split('/images/')[1];
                /* Fonction suppression fichier: 1er arg= chemin fichier 2e = callback (que faire une fois fichier suppr ? = suppr objet dans la base) */
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({ message:'Sauce supprimée !'}))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ message: error.message }));
        } else {
            // Sinon renvoie une erreur et stoppe le code
            return res.status(403).json({message: `403: unauthorized request `})
        }
    })
}

/* Export de la fonction gérer les likes d'une sauce */
exports.isItLiked = (req, res, next) => {
    const nomberOfUserLike = req.body.like;
    console.log('nomberOfUserLike: ', nomberOfUserLike);
    const userId = req.body.userId;
    console.log('userId: ', userId);
    const sauceId = req.params.id;
    console.log('quel id ?' , req.user);
        
        // like = 1
        if (nomberOfUserLike == 1) {
            console.log('nomberOfUserLike dans 1:', nomberOfUserLike);
            Sauce.updateOne({_id:sauceId},
            // Ajoute id dans tab usersLiked , ajoute 1 like
            {$push: {usersLiked: userId}, $inc: {likes: 1}})
            .then(() => res.status(200).json({ message: `L'utilisateur aime cette sauce !`}))
            .catch(error => res.status(400).json({ error }));  
        } 

        // Si like = -1
        else if(nomberOfUserLike == -1) {
        
        Sauce.updateOne({_id: sauceId},
        // Ajoute id au tab usersDisliked, ajoute un dislike
        {$push: { usersDisliked: userId}, $inc: {dislikes: 1}})
        .then(() => res.status(200).json({ message: `L'utilisateur déteste cette sauce !`}))
        .catch(error => res.status(400).json({ error }));
        }

        // Si like = 0
        else if(nomberOfUserLike == 0) {

            Sauce.findOne({_id:sauceId}) 
            .then(sauce => {
                // Vérifie si le tab contient l'userId
                if(sauce.usersLiked.includes(userId)) {
                    
                    Sauce.updateOne({_id: sauceId},
                    // Retire id du tab, retire 1 like
                    {$pull: {usersLiked: userId}, $inc: {likes: -1}})
                    
                    .then(() => res.status(200).json({ message: `L'utilisateur n'aime plus cette sauce !`}))
                    .catch(error => res.status(400).json({ error })); 
                    
    
                } else if(sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({_id: sauceId},
                    // Retire id du tab, retire 1 dislike
                    {$pull: {usersDisliked: userId}, $inc: {dislikes: -1}})
                    
                    .then(() => res.status(200).json({ message: `L'utilisateur ne déteste plus cette sauce !`}))
                    .catch(error => res.status(400).json({ error }));
                    
                }
            })
            .catch(error => res.status(500).json({ message: error.message })) 
        }
}