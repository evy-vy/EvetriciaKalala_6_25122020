//App.js


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');


//permet la connexion appli/DB

mongoose.connect(process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
app.use(helmet());


// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//permet de lire le corps de la requête d'un objet JSON entrant pour rendre l'objet utilisable.cette fonction est utilisé sur toutes les routes de l'API

app.use(express.json());

app.use(mongoSanitize());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Vous avez atteint le nombre de tentative de connexion, veulliez rééssayer dans une heure'
});

app.use('/api', limiter)


// express doit traiter la ressources images de manière statique chaque fois qu'elle reçoit une requête vers la route images. Path donne acces au chemin du systeme de fichier.dirname correspond au dossier dans lequel on va se trouver auquel on ajoute image

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;