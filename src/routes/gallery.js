const {
   getAllGalleries,
   createGallery,
   getGalleryById,
   deleteGallery,
} = require("../controller/galleries");
const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router.get("/", getAllGalleries);

router.post("/create", verifyTokenAndAuthorization, createGallery);

router.get("/:id", getGalleryById);

router.delete("/delete/:id", verifyTokenAndAuthorization, deleteGallery);

module.exports = router;
