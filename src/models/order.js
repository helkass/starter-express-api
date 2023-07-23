const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
   {
      _id: {
         type: String,
         required: true,
      },
      customerId: {
         type: String,
         required: true,
         maxLength: 80,
      },
      customer_name: {
         type: String,
         required: false,
      },
      products: [
         {
            productId: {
               type: String,
            },
            quantity: {
               type: Number,
               default: 1,
            },
            product_name: {
               type: String,
            },
         },
      ],
      response_midtrans: {
         type: String,
      },
      status: {
         type: String,
         default: "non-processed",
      },
      review: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
