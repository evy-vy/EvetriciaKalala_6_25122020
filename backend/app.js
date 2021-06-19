/*
* Express = framework pour node.js qui permet de creer une appli web plus simplement. Elle fournit un ensemble de méthode permettant de traiter les requêtes HTTP et fournit un système de middleware pour étendre ses fonctionnalitées.
* Mongoose
* Helmet aide à protéger votre application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.
* Path donne accès au chemin du système de fichier
*/

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://janeDoe:soPekocko@cluster1.bkypy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//on utilise le framework express dans l'app  
const app = express();
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

/*
* express doit traiter la ressources images de manière statique chaque fois qu'elle reçoit une requête vers la route images.
* path donne acces au chemin du systeme de fichier.dirname correspond au dossier dans lequel on va se trouver auquel on ajoute image
*/
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;