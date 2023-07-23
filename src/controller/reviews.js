const Review = require("../models/reviewsModel");
const { updateStatusReviewOrder } = require("./orders");

// add review on order
const createReview = async (req, res) => {
   const formData = req.body;

   try {
      await Review.create({ ...formData });
      await updateStatusReviewOrder(formData.order_id);
      res.status(202).json({
         message: "review has been created on this order",
      });
   } catch (error) {
      res.status(500);
   }
};

// get all reviews
const getReviews = async (req, res) => {
   const { limit, rating, product_id } = req?.query;

   try {
      let response = null;
      response = await Review.find()
         .sort({ createdAt: -1 })
         .limit(limit || 10);

      if (rating) {
         //  check rating value
         // if query rating > 5 return original response
         if (rating > 5) {
            res.status(200).json(response);
         }

         if (product_id) {
            res.status(200).json(
               response.filter((res) => res.products.includes(product_id))
            );
         } else {
            res.status(200).json(
               response.filter((data) => data.rating >= rating)
            );
         }
      } else if (product_id) {
         res.status(200).json(
            response.filter((res) => res.products.includes(product_id))
         );
      } else {
         res.status(200).json(response);
      }
   } catch (error) {
      res.status(500);
   }
};

const deleteReview = async (req, res) => {
   const { id } = req.params;
   try {
      await Review.findByIdAndDelete(id);
      res.status(200).json({ message: "Delete Successfully" });
   } catch (error) {
      res.status(500);
   }
};

module.exports = {
   createReview,
   getReviews,
   deleteReview,
};
