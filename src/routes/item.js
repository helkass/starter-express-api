const router = require("express").Router();
const {
   getAllItems,
   createItem,
   getItemById,
   deleteItem,
   editItem,
} = require("../controller/items");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router.get("/", getAllItems);

router.get("/:id", getItemById);

router.post("/create", verifyTokenAndAuthorization, createItem);

router.put("/edit/:id", verifyTokenAndAuthorization, editItem);

router.delete("/delete/:id", verifyTokenAndAuthorization, deleteItem);

module.exports = router;
