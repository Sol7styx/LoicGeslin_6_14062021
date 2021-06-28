const http = require('http'); // Importation du package HTTP de node pour permettre de créer un serveur
const app = require('./app'); // Importation du app.js présent dans le dossier, pour utilisation de l'application sur le serveur

// normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10); //La fonction parseInt() analyse une chaîne de caractère fournie en argument et renvoie un entier exprimé dans une base donnée (ici base 10 = base décimale)
//parseInt renvoie un entier. Si le premier caractère ne permet pas d'obtenir un nombre d'après la base fournie, ce sera Nan qui sera renvoyé
    if (isNaN(port)) {  //Si la constante "port" n'est pas un nombre (isNaN)
        return val;
    }
    if (port >= 0) {    //Si la valeur de la contante "port" est supérieure à 0 donc valide, la fonction renvoie la constante port
        return port;
    }
    return false;  //sinon port<0 la fonction renvoie false
};
const port = normalizePort(process.env.PORT || '3000'); //Si process.env.PORT(port d'environnement lors du démarrage) n'est pas disponible alors on se sert du port 3000.
app.set('port', port);

// errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app); //  Création du serveur du package HTTP qui prends en argument la fonction app.
//Lance le serveur 
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);// Le serveur écoute le port
