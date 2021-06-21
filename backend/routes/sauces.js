/*Les routes: ExpressJS se présente comme un routeur où l'on va déclarer les routes supportées par notre application ainsi que le traitement à effectuer lorsque cette dernière est rencontrée.
*
*
* on applique le middleware auth aux routes que l'on souhaite proteger
*/


const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

/*routes sauces*/

//route Post sauce qui capture et enregistre l'img, analyse la sauce et l'enregistre dans la bdd. remet les like et dislike à 0 et les tableaux userLiked et userDisliked vide
//multer est ajouté à la requete poste car on ajoute une photo a la creation de produit
router.post('/', auth, multer, sauceCtrl.createSauce);

//route Post id sauce like définit le statut j'aime pour l'userID fourni(1 = j'aime, 0 = annule, -1 = j'aime pas). L'id user doit être ajouté ou supprimé du tableau approprié et garder un trace de ce qu'il a aimé ou non en l'empêchant d'aime ou non plusieur fois la meme sauce. Une MAJ doit être faite a chaque j'aime
router.post('/:id/like', auth, sauceCtrl.likeOrDislikeSauce);

//route delete id supprime la sauce avec l'id fourni 
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//route Put id MAJ la sauce avec l'id fourni, MAJ de l'image si new img, sinon maj des infos concernés(name, heat...)
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

//route Get sauce id qui renvoi la sauce avec l'id fourni
router.get('/:id', auth, sauceCtrl.getOneSauce);

//route Get qui renvoi le tableau de toutes les sauces dans la base de donnée
router.get('/', auth, sauceCtrl.getAllSauce);

module.exports = router;