// Fichier des routes disponible dans l'application

const express = require('express');
const router = express.Router(); // Création d'un router via express
const sauceCtrl = require('../controllers/sauces'); // Importation du contrôleur

const auth = require('../middleware/auth'); //importation de la fonction pour l'authentification pour sécuriser les routes

const multer = require('../middleware/multer-config'); //importation de multer configuré pour la gestion des images



router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, sauceCtrl.likeOneSauce);

// Exportation du router de ce fichier
module.exports = router;