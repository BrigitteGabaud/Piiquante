"use strict";
/* Import des dépendances */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // plugin verifiant unicité de mot de passe

/* Création schéma de données user */
const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true}, 
    password: {type: String, require: true}
});

/* Application plugin sur schema */
userSchema.plugin(uniqueValidator);

/* Export schéma de données user */
module.exports = mongoose.model('User', userSchema);