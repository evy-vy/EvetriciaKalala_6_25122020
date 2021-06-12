const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth'); //on applique le middleware auth aux routes que l'on souhaite proteger
const multer = require('../middleware/multer-config');

/*routes sauces*/

//route Post sauce et img
router.post('/', auth, multer, sauceCtrl.createSauce);//multer est ajouté à la requete poste car on ajoute une photo a la creation de produit

//route Post id sauce like
router.post('/:id', auth, multer, sauceCtrl.likeOrDislikeSauce);

//route Put id sauce
router.put('/:id', auth, sauceCtrl.modifySauce);

//route delete id sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//route Get id sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);

//route Get tableau sauces
router.get('/', auth, sauceCtrl.getAllSauce);

module.exports = router;