const Sauce = require('../models/sauces');

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
    Sauce.updateOne({_id: req.params.id }, {...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
}

/* Export de la fonction suppression sauce */
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({_id: req.params.body})
    .then(() => res.status(200).json({ message:'Sauce supprimée !'}))
    .catch(error => res.status(404).json({ error }));
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