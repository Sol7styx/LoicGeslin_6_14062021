const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); //importation du controller
const verifyPassword = require('../middleware/verifyPassword'); //importation du middleware pour vérifier le mot de passe

router.post('/signup', verifyPassword, userCtrl.signup); //route pour enregistrer un utilisateur
router.post('/login', userCtrl.login); //router pour connection utilisateur inscrit

module.exports = router;
