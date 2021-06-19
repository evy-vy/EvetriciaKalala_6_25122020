/*
* Le middleware auth permet de proteger les routes selectionnées et d'authentifier l'utilisateur avant l'envoi des requêtes. Il chiffre le mdp de l'utilisateur et de l'ajouter à la base de donnée, de verif les infos d'identification de l'utilisateur
* jwt 
*/
const jwt = require('jsonwebtoken');

/*
* On verifie que le token de l'utilisateur correspond à l'id utilisateur dans la requête
* Pour extraire le token on le récupère dans le header authorization, on split autour des données qui s'y trouve, ce qui va nous donner un tableau dans lequel on recupère le header.
* on décode le token avec la fonction verify
* on extrait l'id du token
* on vérifie si l'id saisie dans la requête = à l'id utilisateur
* si tout est ok on passe au middleware suivant
* sinon une erreur est renvoyée
*/

module.exports = ((req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodetToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodetToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée' })
  }
});

