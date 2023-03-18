const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const {
   getAllBlogs,
   createBlog,
   getBlogById,
   deleteBlog,
} = require("../controller/blogs");

router.get("/", getAllBlogs);

router.post("/create", verifyTokenAndAuthorization, createBlog);

router.get("/:id", getBlogById);

router.delete("/delete/:id", verifyTokenAndAuthorization, deleteBlog);

module.exports = router;
