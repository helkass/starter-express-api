const mongoose = require("mongoose");

// TEST
const ItemSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         maxLength: 60,
      },
      desc: {
         type: String,
         required: true,
         maxLength: 200,
      },
      image: {
         public_id: {
            type: String,
            required: false,
         },
         url: {
            type: String,
            required: false,
         },
      },
      medium: {
         type: Number,
         required: false,
      },
      large: {
         type: Number,
         required: false,
      },
      size: {
         type: Number,
         required: false,
      },
      price: {
         type: Number,
         required: false,
      },
      type: {
         type: String,
         default: "bottle",
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
