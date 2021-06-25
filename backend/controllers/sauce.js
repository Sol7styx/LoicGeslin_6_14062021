//importation module file system de node permettant de gérer les téléchargements et modification d'image
const fs = require('fs');
//importation du modèle mongoose
const Sauces = require('../models/Sauces');

//Création d'une nouvelle sauce (Post)
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce) //on stocke les données envoyées par le front-end et on les transforme en objet JavaScript
    delete sauceObject._id //supprime l'id généré automatiquement et envoyé par le frontend.
    //l'id de la sauce est créé par la base MongoDB lors de la création de la sauce
    const saucce = new Sauce ({  //création d'un nouvel objet sauce
        ...sauceObject,
        //création de l'Url de l'image : http://localhost:3000/image/nomdufichier
        imageUrl :`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() //enregistrement de l'objet sauce dans la base de données
        .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
        .catch((error) => res.status(400).json({ error }));
};

//Lecture de toutes les sauces dans la base de données (GET)
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//Lecture d'une sauce avec son id (Get/:id)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ....JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

//Suppression de la sauce
exports.deleteSauce = (req, res, next) => {
    //Avant de supprimer l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            //on appelle unlink pour supprimer le fichier
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.Status(400).json({ error }));
            });
        })
    .catch(error => res.status(500).json({ error }));
};

//Pour liker et disliker
exports.likeSauce = (req, res, next) => {
    //On utilise la méthode findOne pour obtenir la sauce en fonction de son Id dans la BDD
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
        //
        if (req.body.like === 1) {
            sauce.likes++;
            sauce.usersLiked.push(req.body.userId)
            console.log('like ajouté !')
        }

        if (req.body.like === -1) {
            sauce.dislikes++;
            sauce.usersDisliked.push(req.body.userId)
        }
        if (req.body.like === 0) {
            if (sauce.usersLiked.some(userId => req.body.userId == userId)) {
            sauce.likes--;
            sauce.usersLiked = sauce.usersLiked.filter(userId => req.body.userId != userId);
            }
            else {
            sauce.dislikes--;
            sauce.usersDisliked = sauce.usersDisliked.filter(userId => req.body.userId != userId);
            }
        }
        sauce.save()
          //envoi une réponse au frontend avec un statut 200 sinon on a une expiration de la requête
            .then((sauce) => res.status(200).json({ message: ' Votre avis est pris en compte !' }))
          // On ajoute un code erreur en cas de problème
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};