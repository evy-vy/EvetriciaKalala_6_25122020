/*

*Le module dotenv permet de masquer les informations de connexion à la bdd grâce aux variables d'environnement
* Express = framework pour node.js qui permet de creer une appli web plus simplement. Elle fournit un ensemble de méthode permettant de traiter les requêtes HTTP et fournit un système de middleware pour étendre ses fonctionnalitées.
* Mongoose
* Helmet aide à protéger votre application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.
* mongoSanitize nettoie les données fournie par l'utilisateur afin d'empecher l'injection
* Path donne accès au chemin du système de fichier
*/

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

mongoose.connect(process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/*
*on utilise le framework express dans l'app
* Helmet sécurise l'application avec les En-têtes HTTP. Par défaut, il aide à appliquer les en-têtes suivants.
- Pré-extraction DNS
- Masquer X-Powered-By
- HTTP Strict Transport Security
- Pas de reniflement
- Protections XSS : //nettoie n'importe quel entrée de code html par un utilisateur 
- ...
*/
const app = express();
app.use(helmet());

//CORS (Cross Origin Ressource Sharing). Système de sécurité qui par défaut bloque les appels HTTP effetués entre des serveurs différents, ce qui empeche les requêtes malveillantes d'accéder a des ressources sensibles. Dans notre cas nous avons 2 origines (localhost:3000 pour le front et 4200 pour le back). Pour qu'elles puissent communiquer on ajoute des headers à l'objet response (res) qu'on envoi au navigateur pour lui permettre d'utiliser l'API.Cest grace au middleware ci-dessous qui sera appliqué à toutes les routes, toutes les requêtes envoyé au serveur que cela sera possible.
/* les headers permettent d'acceder a l'api depuis n'importe quel origine
* d'ajouter les headers mentionnées aux requetes envoyés vers l'API
* D'envoyer des requêtes avec les méthodes GET, POST etc
*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//permet de lire le corps de la requête d'un objet JSON entrant pour rendre l'objet utilisable.cette fonction est utilisé sur toutes les routes de l'API
app.use(express.json());


// Data sanitization against NoSQL query injection
// cette fonction suffit pour empêcher les attaques contre les injection NoSQL qui permettrait à n'importe qui d'acceder à la DB en tant qu'aministrateur et de récuperer les données de tous les utilisateurs.
//il analyse l'ensembles des requêtes et filtrera tous les signes suspicieux comme le $ par exemple.
app.use(mongoSanitize());


//ratelimit va compter le nombre de requête provenant d'une meme ip, et s'il dénombre trop de demande de cette api, l'accès à l'api sera bloquée pour cette api.
//Cela permet de lutter contre les deni de service et les attaques de force brute
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Vous avez atteint le nombre de tentative de connexion, veulliez rééssayer dans une heure'
});


app.use('/api', limiter)


/*
* express doit traiter la ressources images de manière statique chaque fois qu'elle reçoit une requête vers la route images.
* path donne acces au chemin du systeme de fichier.dirname correspond au dossier dans lequel on va se trouver auquel on ajoute image
* module.export permet d'expoter les fichiers pour qu'ils soient accessibles depuis les autres fichiers du projet, nottamment le serveur. c'est pourquoi on va importer l'appli dans le fichier server.js et passer l'appli a la fonction createserver (server.js L48).
*/

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

//
module.exports = app;