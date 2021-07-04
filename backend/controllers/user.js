const bcrypt = require('bcrypt'); // Importation du package de cryptage du mot de passe
const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken qui va permettre de créer et gérer les tokens d'authentification
const User = require('../models/user');
const MaskData = require('../node_modules/maskdata'); //module node pour masquer l'email

// Fonction pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)  //crypte le mot de passe
        .then(hash => {
            const user = new User({    //création d'un nouvel utilisateur
                email: MaskData.maskEmail2(req.body.email),
                password: hash
            });
            user.save()  //enregistre dans la base de données
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


// Fonction login pour connecter les utilisateurs existants
exports.login = (req, res, next) => {
    User.findOne({ email: MaskData.maskEmail2(req.body.email) })  
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) //compare le mot de passe de la requête avec le hash de la BDD
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({ //retourne les données attendu par le front
                        userId: user._id,
                        token: jwt.sign( // Fonction d'encodage d'un nouveau token
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};