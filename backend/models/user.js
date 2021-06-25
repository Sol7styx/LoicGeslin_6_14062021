//Le modèle va nous permettre d'insérer des données dans MongoDB en respectant le schéma précisé
//On pourra faire des requêtes
//Importatino de mongoose
const mongoose = require('mongoose');
//importation du packqge pour éviter que 2 utilisateurs utilisent la même adresse mail
const uniqueValidator = require('mongoose-unique-validator');
//Création du schéma de données pour l'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
//applique le validateur au schéma avant d'en faire un modèle et on appelle la méthode plugin et on lui passe un uniqueValidator en argument
userSchema.plugin(uniqueValidator);
//exporte le schéma sous forme de modèle : le modèle se nomme User et on lui passe le schéma de données userSchema
module.exports = mongoose.model('User', userSchema);

