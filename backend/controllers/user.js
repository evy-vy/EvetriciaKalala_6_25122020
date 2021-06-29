//Logique métier appliquées aux routes utilisateurs


/*
* bcrypt est un algorithme permettant le hashage de mdp
*   Le package jwt (jsonwebtoken) permet d'attribuer un token à un utilisateur au moment de sa connexion
* User correspond au schema mangoose
*/

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
const User = require('../models/user');

let key = cryptoJs.enc.Hex.parse('' + process.env.AES_KEY + '');
let iv = cryptoJs.enc.Hex.parse('' + process.env.AES_IV + '');


const checkMail = (mail) => {
  let regExpMail = new RegExp("^[0-9a-zA-Z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}");
  return regExpMail.test(mail);
};

const checkPassword = (password) => {
  let regExPassword = new RegExp("^[0-9a-zA-Z-+!*@%_]{8,15}");
  return regExPassword.test(password);
};

exports.signup = (req, res, next) => {
  if (!checkMail(req.body.email)) {
    res.status(400).json({ message: "Veuillez saisir une adresse email valide" });
  } else if (!checkPassword(req.body.password)) {
    res.status(400).json({ message: "Merci de saisir un mot de passe sécurisé : 8 caractères min, 15 caractères max, au moins : 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial" })
  } else {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: cryptoJs.AES.encrypt(req.body.email, key, { iv: iv }).toString(),
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  }
};


//middleware pour la connexion d'un utilisateur
/*
* On récupère le mail passé dans le corps de la requete
* on compare le mail de l'utilisateur, s'il est différent une erreur est retourné
* sinon on compare le mdp et le hash
* si incorrect, une erreur est renvoyé
* si ok 
*/

exports.login = (req, res, next) => {
  let encryptedEmail = cryptoJs.AES.encrypt(req.body.email, key, { iv: iv }).toString();
  User.findOne({ email: encryptedEmail })
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
              process.env.TOKEN, //contient une chaine secrete de developpement temporaire pour encoder le token
              { expiresIn: '10h' }
            )//la fonction sign permet d'encoder un new token qui contient l'id utilisateur en tant que payload 
          });
        })
        .catch(error => res.status(500).json({ error })); //erreur server
    })
    .catch(error => res.status(500).json({ error }));
};