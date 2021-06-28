//le modèle va permettre d'insérer des données dans MongoDB en respectant le schéma précisé et de faire des requêtes dessus

const mongoose = require('mongoose'); //importation mongoose

const sauceSchema = mongoose.Schema({ 
    userId: { type: String, required: true }, // on créer le schéma de données Sauce avec le type de champs requis
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

module.exports = mongoose.model('sauce', sauceSchema); // Exporte le modèle ( premier argument = nom du modèle, deuxiéme argument = schéma créé )