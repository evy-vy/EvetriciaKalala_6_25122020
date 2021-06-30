//controllers sauce

// file system de node donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.

const Sauce = require('../models/sauce');
const fs = require('fs');


//creation d'une sauce

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


//renvoi toutes les sauces

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


//switch like/dislike : La condition switch me permet d'appliquer différente instructions selon les 3 cas: 

exports.likeOrDislikeSauce = (req, res) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

  switch (like) {
    case 0:
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
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

          } if (sauce.usersDisliked.includes(userId)) {
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
