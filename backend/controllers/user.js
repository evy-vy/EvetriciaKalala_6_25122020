const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });//401 = non autorisé
      }
      bcrypt.compare(req.body.password, user.password)//on compare le mdp utilisateur et le hash
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET', //chaine secrete de developpement temporaire pour encoder le token
              { expiresIn: '24h' }
            )//la fonction sign permet d'encoder un new token qui contient l'id utilisateur en tant que payload 
          });
        })
        .catch(error => res.status(500).json({ error })); //erreur server
    })
    .catch(error => res.status(500).json({ error }));
};