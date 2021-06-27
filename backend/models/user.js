const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator'); // Package de validation pour éviter les erreurs générées par défaut par MongoDB

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // mot clé unique pour empêcher l'utilisation d'une même adresse mail.
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); // le plugin s'assurera qu'aucun des deux utilisateurs ne puissent partager la même adresse mail

module.exports = mongoose.model('user', userSchema);