const Sauce = require('../models/sauce');
const fs = require('fs');// file system de node donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.

exports.createSauce = (req, res, next) => { //creation d'une sauce
  const sauceObject = JSON.parse(req.body.sauce); //pour ajouter un fichier à la requête, le front envoi les données sous la forme form-data et non pas JSON. la requête sauce sera donc un string qu'il faut transformer en objet exploitable
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//ex: http://localhost:3000/images/nom de fichier
  });
  sauce.save()
    .then(() => res.status(201).json({ sauce }))
    .catch(error => res.status(400).json({ error }));
}

exports.likeOrDislikeSauce = (req, res, next) => {
  Sauce.updateOne() // a corriger
    .then(() => res.status(200).json())
    .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {

  const sauceObject = req.file ? //on verifie si un fichier est modif. si oui on recup la chaine de caractère et la transforme en ojt exploitable et on génère une nouvelle image url
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; //sinon on recupère le corps de la requête
  Sauce.updateOne({ _id: req.params.id },
    { ...sauceObject, _id: req.params.id })//on récup l'objet créé et on modif l'id pour qu'il corresponde a celui des params de requête
    .then(() => res.status(201).json({ message: 'modifided' }))
    .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {


  Sauce.deleteOne({ _id: req.params.id }) //on récupère l'id reçu comme param correspondant à la sauce dans la base de donnée
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];//on utilise le segment /images/ contenu dans l'url pour séparer le nom de fichier
      fs.unlink(`images/${filename}`, () => {//la fonction unlink supprime les fichiers
        Sauce.deleteOne({ _id: req.params.id })//suppréssion de l'objet dans la base
          .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne()
    .then(() => res.status(200).json())
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(() => res.status(200).json())
    .catch(error => res.status(400).json({ error }));
};