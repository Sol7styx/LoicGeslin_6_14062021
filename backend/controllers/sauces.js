// Fichier regroupant la logique des différentes fonctions.
const Sauce = require('../models/sauces'); //importation du modéle mongoose
const fs = require('fs'); //importation du module 'file system" de Node permettant de gérer les téléchargements et moodifications d'image


// Création et enregistrement d'une sauce dans la base de donnée
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // Suppresion du champs id du corps de la requête avant de copier l'objet
    const sauce = new Sauce({
        ...sauceObject, // Cela va copier les champs du corps de la requête
        // Création de l'URL de l'image : http://localhost:3000/image/nomdufichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    //Enregistrement de l'objet sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
        .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce existante
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })  
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    console.log('Image supprimée');
                });
            })
            .catch(error => res.status(500).json({ error }));
    };
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Suppresion d'une sauce existante
exports.deleteSauce = (req, res, next) => {
    //Avant de supprimer l'objet, on va le cherhcher pour obtenir l'url de l'image et supprimer le fichier image de la base
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //récupération du nom du fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            //on efface le fichier (unlink)
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

// Récupération d'une sauce avec son ID
exports.getOneSauce = (req, res, next) => {
    //On utilise la méthode findOne et on lui passe l'objet de comparaison , on veut que l'id de la sauce soit le même que le paramètre de requête
    Sauce.findOne({ _id: req.params.id })
        //Si c'est ok, on retourne une réponse et l'objet
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Récupération de toute les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).jsons({ error }));
};


// Création like ou dislike (Post/:id/like)
exports.likeOrNo = (req, res, next) => {
    // Si l'utilisateur aime la sauce
    if (req.body.like === 1) { 
      // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
        .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) { 
      // Si l'utilisateur n'aime pas la sauce
      // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } }) 
        .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
        .catch(error => res.status(400).json({ error }));
    } else { 
      // Si like === 0 l'utilisateur supprime son vote
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          // Si le tableau "userLiked" contient l'ID de l'utilisateur
            if (sauce.usersLiked.includes(req.body.userId)) { 
            // On enlève un like du tableau "userLiked" 
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                .catch(error => res.status(400).json({ error }))
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
              // Si le tableau "userDisliked" contient l'ID de l'utilisateur
              // On enlève un dislike du tableau "userDisliked" 
                Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                .catch(error => res.status(400).json({ error }))
            }
        })
        .catch(error => res.status(400).json({ error }));
    }
};
