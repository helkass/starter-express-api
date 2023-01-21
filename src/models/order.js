const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },
    customerId: {
      type: String,
      required: true,
      maxLength: 80,
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
        product_name : {
          type: String
        }
      },
    ],
    response_midtrans: {
      type: String,
    },
    status : {
      type : String,
      default : "non-processed"
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", OrderSchema);