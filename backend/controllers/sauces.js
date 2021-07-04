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
    const sauceObject = req.file ?
    //Si il existe déjà une image
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    //Si il n'existe pas d'image
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(201).json({ message: 'Sauce modifiée' }))
        .catch(error => res.status(400).json({ error }));
};

// Suppresion d'une sauce existante
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //récupération du nom du fichier
            const filename = sauce.imageUrl.split('/image/')[1];
            //on efface le fichier (unlink)
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(201).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Récupération d'une sauce avec son ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Récupération de toute les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).jsons({ error }));
};



// Like / Dislike sauce
exports.likeOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                case -1:
                    sauce.dislikes = sauce.dislikes + 1;
                    sauce.usersDisliked.push(req.body.userId);
                    sauceObject = {
                        "dislikes": sauce.dislikes,
                        "usersDisliked": sauce.usersDisliked
                    }
                    break;
                case 0:
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== req.body.userId);
                        sauce.dislikes = sauce.dislikes - 1;
                        sauceObject = {
                            "dislikes": sauce.dislikes,
                            "usersDisliked": sauce.usersDisliked
                        }
                    } else {
                        sauce.usersLiked = sauce.usersLiked.filter(user => user !== req.body.userId);
                        sauce.likes = sauce.likes - 1;
                        sauceObject = {
                            "likes": sauce.likes,
                            "usersLiked": sauce.usersLiked
                        }
                    }
                    break;
                case +1:
                    sauce.likes = sauce.likes + 1;
                    sauce.usersLiked.push(req.body.userId);
                    sauceObject = {
                        "likes": sauce.likes,
                        "usersLiked": sauce.usersLiked
                    }
                    break;
                default:
                    return res.status(500).json({ error });
            }
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce liké !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(() => res.status(400).json({ error: 'Sauce non trouvée !' }));
}