const express = require('express'); // importation express
const app = express(); //création d'une application express

const mongoose = require('mongoose'); // importation mongoose

//Se connecter à la BDD
mongoose.connect('mongodb+srv://Sol7styx:Joshua72@clusterp06.lrpq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Middleware header pour éviter les erruers sécurité CORS, afin que tout le monde puisse faire des requêtes 
app.use((req, res, next) => {
    //les ressources peuvent être partagées depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    //On indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //On indique les méthodes autorisées pour les requêtes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PÄTCH, OPTIONS');
    next(); 
});

module.exports = app;