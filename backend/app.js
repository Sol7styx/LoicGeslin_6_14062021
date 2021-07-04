const express = require('express'); // Importation du framework Express
const app = express(); // Création d'une application express
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Importation de mongoose pour ce connecter à notre cluster mongoDB

const helmet = require("helmet"); //importation de helmet
const path = require('path'); //Importation du package pour avoir accès au chemlin du fichier
const mongoSanitize = require('express-mongo-sanitize'); //importation du package pour nettoyer les entrées utilisateurs
//importation des routes
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');



//logique pour se connecter à la BDD
mongoose.connect('mongodb+srv://Sol7styx:dbjoshua72@cluster0.vuqd4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Middleware Header pour éviter les erreurs de CORS (sécurité) afin que tout le monde puisse faire des requêtes depuis son navigateur
// '*' tout le monde peut accéder à l'API, Headers : autorisation d'utiliser certains en-tête sur l'objet requête et Methods : méthodes (get, post etc) autorisées pour les requêtes HTTP
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(express.json());// Va transformer le corps de la requête en objet JS utilisable

//Middleware de protection contre les attaques
app.use(helmet());
app.use(mongoSanitize());
app.use('/api/auth', userRoutes); // Importation de la route depuis le fichier user.js du dossier routes
app.use('/api/sauces', sauceRoutes); // Importation des routes depuis le fichier sauce.js du dossier routes
app.use('/images', express.static(path.join(__dirname, 'images'))); // Middleware qui permet de charger les fichiers qui sont dans le répertoire images




module.exports = app; // Exportation de la const app pour y accèder depuis les autres fichiers.