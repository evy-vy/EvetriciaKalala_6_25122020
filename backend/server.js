/*
* Le serveur: On y écrit un programme qui écouter des requêtes http auxquelles le serveur répond
*
* On importe le package http de node. 
*Cette objet http permet de creer un serveur grace à 'createserver' du package http. 
* Cette fontion sera appelé a chaque requête reçu par le serveur
* Le serveur doit écouter les requêtes envoyées. Dans ce cas on utilise la méthode 'listen' du serveur et on lui passe le port que l'on souhaite écouter par défaut (3000) si ce port est occuper alors on utilise une variable environnement 'process.env.PORT' pour utilisé un port par défaut que propose la variable d'environnement. 
*/


const http = require('http');
const app = require('./app');


//normalizePort renvoie un port valide, qu'il soit fourni sous forme de num ou de chaine;
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


//la fonction errorHandle recherche les différentes erreurs et les gères de manière approprié. 
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

const server = http.createServer(app);

//écouteur d'évènement enregistré, qui consigne le port ou le canal sur lequel le serveur s'exécute dans la console
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});


server.listen(port);