const express = require('express');
const router = express.Router();

const posteCtrl = require('../controllers/poste-ctrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//CRUD
router.post('/', auth, multer, posteCtrl.createPoste);
router.put('/:id', auth, multer, posteCtrl.modifyPoste);
router.delete('/:id', auth,  posteCtrl.deletePoste);
router.get('/:id', auth,  posteCtrl.getOnePoste);
router.get('/', auth, posteCtrl.getAllPoste);
router.post('/:id/like', auth,posteCtrl.likeOrDislike);

module.exports = router;
