const Sauce = require('../models/sauces');
/* donne accès aux opérations liées aux syst de fichiers */
const fs = require('fs'); 

/* Export de la fonction création Sauce (POST) */
exports.createSauce = (req, res, next) => {
    /* Convertit chaîne caractères (= objet js) du corps requête 'req.body.sauce' en objet json extrait du 'sauce' */
    const sauceObject = JSON.parse(req.body.sauce);
    /* Supprime id de sauceObject */
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, 
        /* Génère url image = protocole + nom hôte + 'image' + nom fichier */
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
}

/* Export de la fonction modification sauce */
exports.modifySauce = (req, res, next) => {
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
}

/* Export de la fonction suppression sauce */
exports.deleteSauce = (req, res, next) => {
    /* Accède à l'objet pour récup url image + nom fichier */
    Sauce.findOne({_id: req.params.id})
    /* callback récupère sauce + nom exact fichier */
    .then(sauce => {
        /* Extrait nom du fichier à suppr :Récupère imageUrl sauce retournée / base + split autour '/images/' et retourne tableau de 2 elmts avant/ après /images/ */
        const filename = sauce.imageUrl.split('/images/')[1];
        /* Fonction suppression fichier: 1er arg= chemin fichier 2e = callback (que faire une fois fichier suppr ? = suppr objet dans la base) */
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.body})
                .then(() => res.status(200).json({ message:'Sauce supprimée !'}))
                .catch(error => res.status(404).json({ error }));
        })
    })
    .catch(error => res.status(500).json({ error}));
};

/* Export de la fonction récupération une sauce */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

/* Export de la fonction récupération de toutes les sauces */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };

/* Export de la fonction like une sauce
exports.likeOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const likesNumber = sauce.likes
    })
    .catch(error => res.status(400).jon({ error }));
}*/