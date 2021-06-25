//Le modèle va permettre d'insérer des données dans MongoDB en respectant le schéma précisé 
//Cela permettra aussi de faire des requête sur ces données
//Importation mongoose
const mongoose = require('mongoose');
//Schéma de données Sauces
const sauceSchéma = mongoose.Schéma({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufactuer: { type: String, reqzuired: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Nuumber, required: true },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

module.exports = mongoose.model('sauce', sauceSchema); //export du modèle (premier argument = nom du modèle, deuxième argument: schéma crée)
