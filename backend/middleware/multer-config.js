const multer = require('multer'); //permet de gerer les fichiers.

const MINE_TYPES = { //objet qui défini les extensions de fichiers
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
    const extensions = MINE_TYPES(file.mimetype); //élément du dictionnaire qui correspond au mine type generé par le front end
    callback(null, name + Date.now() + '.' + extension);//correspond au nom généré plus haut + timestamp pour le rendre unique + point et extension du fichier
  }
});

module.exports = multer({ storage }).single('images'); //on passe l'objet storage, on ajoute single pour dire qu'il s'agit d'un fichier unique et image pour dire qu'il s'agit du dossier images