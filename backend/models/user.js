// Importation mongoose
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator'); //Importation du package pour éviter que plusieurs utilisateurs n'aient le même mail

const userSchema = mongoose.Schema({ //Création du schéma de données pour l'utilisateur
    email: { type: String, required: true, unique: true }, // mot clé unique pour empêcher l'utilisation d'une même adresse mail.
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); // le plugin s'assurera que plusieurs utilisateurs ne puissent partager la même adresse mail

module.exports = mongoose.model('user', userSchema);