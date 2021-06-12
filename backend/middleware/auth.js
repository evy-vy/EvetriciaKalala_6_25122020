/*Le middleware auth permet de proteger les routes selectionnées et d'authentifier l'utilisateur avant l'envoi des requêtes*/

const jwt = require('jsonwebtoken');

module.exports = ((req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//on extrait le token du header authorization. on split autour des données qui s'y trouve. cela crée un tableau dans lequel on recupère le header
    const decodetToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//on décode le token avec la fonction verify
    const userId = decodetToken.userId; // on extrait l'id du token 
    if (req.body.userId && req.body.userId !== userId) { // si l'id saisi correpond a l'id utilisateur on passe au middleware suivant. sinon on est renvoyé vers catch
      throw 'User ID non valable';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée' }) // catch récupère et renvoi les erreurs 
  }
});