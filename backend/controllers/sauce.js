// file system de node donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const Sauce = require('../models/sauce');
const fs = require('fs');


//creation d'une sauce
/*
*pour ajouter un fichier à la requête, le front envoi les données sous la forme form-data et non pas JSON. la    requête sauce sera donc un string qu'il faut transformer en objet exploitable
* On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
*création d'une instance de l'objet Sauce
* imageUrl: ex: http://localhost:3000/images/nom de fichier
*/

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Votre sauce à été enregistrée ! ' }))
    .catch(error => res.status(400).json({ error }));
}


//modification de la sauce (opérateur ternaire)
/* 
* Lors de la modif, on verifie si un fichier a été modifié. 
* on récupère la sauce modif grace à son id trouvé dans les params de la requête
* on utilise l'url de l'image pour en extraire le segment /images/ contenu dans l'url pour séparer le nom de fichier
* on récupère l'ancien fichier puis on le supprime
* unlinkSync supprime le fichier de manière synchrone(le fichier doit être supprimé avant l'exécution des instructions suivante)
* on paramètre le corps de la requête de la sauce pour pouvoir manipuler les données et remplacer ajouter la nouvelle image. 
* SINON 
* les paramètres de la sauces présent dans le corps de la requête sont récupérées 
* Les données de la sauce sélectionnée par son id sont MAJ
*/

exports.modifySauce = (req, res, next) => {
  let sauceObject;
  req.file ? (
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename
        }`,
    }
  ) : (sauceObject = { ...req.body })
  Sauce.updateOne(
    {
      _id: req.params.id
    }, {
    ...sauceObject,
    _id: req.params.id
  })
    .then(() => res.status(200).json({
      message: 'Sauce modifiée !'
    }))
    .catch((error) => res.status(400).json({
      error
    }))
}

//supprime la sauce et le fichier dans le dossier img
/*
* on récupère l'id reçu comme param correspondant à la sauce dans la base de donnée
* on utilise récupère l'url de l'image et en extrait le segment /images/ contenu dans l'url pour séparer le nom de fichier
* la fonction unlink supprime les fichiers
* on supprime donc le fichier correspondant de la bdd
*/

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(400).json({ error }));
};


//renvoi la sauce sélectionnée grace à son id

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};


//renvoi toutes les sauce
/*
* find permet de récupérer l'ensemble des sauces disponible dans le tableau des sauces dans la base de donnée
* si tout est ok, le données sont retournées
* sinon on retourne un message d'erreur
*/

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


//switch like/dislike
/*
* La condition switch me permet d'appliquer différente instructions selon les 3 cas: 
*
* Cas 1 : Un utilisateur "aime" une sauce : 
Les like de la sauce concernées vont être incrémenté de 1 grâce à l'opérateur $inc de mongodb
$push ajoute une valeur spécifié à un array. Ici l'ID de l'utilisateur votant
*
* Cas -1 : Un utilisateur "n'aime pas" une sauce : 
Même procédé que pour le cas 1
*
* Cas 0 : Un utilisateur annule son choix : 
On récupère la sauce concernée par son ID, 
on vérifie si l'id de l'utilisateur est bien présent dans le tableau usersLiked ou disLiked de la sauce concernée, 
si tel est le cas, on met à jour cette sauce dans la bdd :
avec $pull, on supprime d'id de l'utilisateur du tableau existant
on décrémente le like ou le dislike de -1
*
*/

exports.likeOrDislikeSauce = (req, res) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;
  switch (like) {
    case 0:
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked) {
            Sauce.updateOne({ _id: sauceId }, {
              $pull: { usersLiked: userId },
              $inc: { likes: -1 }
            })
              .then(() => {
                res.status(201).json({ message: "J'aime annulé" });//code 201: created
              })
              .catch((error) => {
                res.status(400).json({ error });
              });

          } if (sauce.userDisliked) {
            Sauce.updateOne({ _id: sauceId }, {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 }
            })
              .then(() => {
                res.status(201).json({ message: "Je n'aime plus annulé" });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    case 1:
      Sauce.updateOne({ _id: sauceId }, {
        $push: { usersLiked: userId },
        $inc: { likes: 1 }
      })
        .then(() => {
          res.status(201).json({ message: "J'aime !" });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
      break;

    case -1:
      Sauce.updateOne({ _id: sauceId }, {
        $push: { usersDisliked: userId },
        $inc: { dislikes: 1 }
      })
        .then(() => {
          res.status(201).json({ message: "Je n'aime pas !" });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
      break;
    default:
      console.log('Bad request');
  }
}
