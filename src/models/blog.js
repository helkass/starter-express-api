const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         maxLength: 60,
      },
      article: {
         type: String,
         required: true,
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
      writer: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
