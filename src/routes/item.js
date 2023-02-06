const router = require("express").Router();
const {
   getAllItems,
   createItem,
   getItemById,
   deleteItem,
   editItem,
} = require("../controller/items");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/", getAllItems);

router.get("/:id", getItemById);

router.post("/create", createItem);

router.put("/edit/:id", editItem);

router.delete("/delete/:id", deleteItem);

module.exports = router;
