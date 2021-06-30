//middleware multer

const multer = require('multer');

//mime_types est un objet qui défini les extensions de fichiers

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

//storage permet de préciser dans quel dossier les fichiers doivent être enregistrés(le fichier images)

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {                    //on récupère le nom de fichier d'origine
    const name = file.originalname.split(' ').join('_');  //on slit pour retirer les espaces que l'on remplace par des _
    const extensions = MIME_TYPES[file.mimetype];         //élément du dictionnaire qui correspond au mime type generé par le front end
    callback(null, name + Date.now() + '.' + extensions); //On génère le nom complet du fichier (nom généré plus haut + timestamp pour le rendre unique + point et extension du fichier)
  }
});

//on passe l'objet storage à multer, on ajoute ma méthode single pour dire qu'il s'agit d'un fichier unique en précisant qu'il s'agit d'une image.

module.exports = multer({ storage }).single('image');