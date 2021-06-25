const express = require('express');
const router = express.Router(); //Création du routeur Express


const auth = require('../middleware/auth'); //importation de la fonction pour l'authentification pour sécuriser les routes
const multer = require('../middelware/multer-config'); //importation de multer configuré pour la gestion des images
const sauceCtrl = require('../controllers/sauce'); //importation du controller
const { route } = require('../app');

router.post('/:id/like', auth, sauceCtrl.likeSauce); //Route pour gérer les like
router.post('/', auth, multer, sauceCtrl.createSauce); //Route pour créer une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); //Route pour modifier une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); //Route pour supprimer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); //Route pour récupérer une sauce
router.get('/', auth, sauceCtrl.getAllSauce); //Route pour récupérer toutes les sauces

//exporte le router
module.exports = router;
