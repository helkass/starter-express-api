const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
   {
      customer_details: {
         customer_id: {
            type: String,
            required: true,
         },
         customer_name: {
            type: String,
            required: true,
         },
         customer_address: {
            type: String,
            required: true,
         },
      },
      order_id: {
         type: String,
         required: true,
      },
      products: [
         {
            type: String,
            required: true,
         },
      ],
      rating: {
         type: Number,
         required: true,
      },
      comment: {
         type: String,
         required: false,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
