const { getAllGalleries, createGallery, getGalleryById, deleteGallery} = require("../controller/galleries");
const router = require("express").Router();

router.get('/', getAllGalleries);

router.post('/create', createGallery);

router.get('/:id', getGalleryById);

router.delete('/delete/:id', deleteGallery);

module.exports = router;