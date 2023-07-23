const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const {
   createReview,
   getReviews,
   deleteReview,
} = require("../controller/reviews");

// get all reviews
router.get("/", getReviews);

// create review
router.post("/create", verifyTokenAndAuthorization, createReview);
router.delete("/delete/:id", verifyTokenAndAuthorization, deleteReview);

module.exports = router;
