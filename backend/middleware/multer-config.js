"use strict";
/* Import package gestion de fichiers */
const multer = require('multer');

/* Dictionnaire mime_types */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image.png': 'jpg'
}

/* Objet de configuration multer */
const storage = multer.diskStorage({ // enregistre sur le disque
    /* Indique dans quel dossier enregistrer les fichiers */
    destination: (req, file, callback) => {
        /* 1er arg null= pas d'erreur, 2e arg nom du dossier */
        callback(null, 'images')
    },
    /* Explique quel nom de fichier utiliser */
    filename: (req, file, callback) => {
        /* Prend nom origine fichier en suppr espaces remplacés par underscores */
        const name = file.originalname.split(' ').join('_');
        /* Création extension fichier à l'aide dico*/
        const extension = MIME_TYPES[file.mimetype];
        /* Appel callback : création filename: name + timestamp (rend unique) + '.' + ext = génération nom fichier unique */
        callback(null, name + Date.now() + '.' + extension);
    }
});

/* Exporte middleware multer en passant objet storage + méthode single = fichier unique + précise = fichiers image */
module.exports = multer({ storage}).single('image');
