const multer = require('multer'); //permet de gerer les fichiers.

const MIME_TYPES = { //objet qui défini les extensions de fichiers
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({//permet de préciser dans quel dossier les fichiers doivent être enregistrés
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extensions = MIME_TYPES[file.mimetype]; //élément du dictionnaire qui correspond au mine type generé par le front end
    // name = file.replace('.' + extensions, '_');
    callback(null, name + Date.now() + '.' + extensions); //correspond au nom généré plus haut + timestamp pour le rendre unique + point et extension du fichier
  }
});

module.exports = multer({ storage }).single('image'); //on passe l'objet storage, on ajoute single pour dire qu'il s'agit d'un fichier unique et image pour dire qu'il s'agit du dossier images