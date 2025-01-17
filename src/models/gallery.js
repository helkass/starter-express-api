const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         maxLength: 60,
      },
      desc: {
         type: String,
         required: false,
         maxLength: 1000,
      },
      image: {
         public_id: {
            type: String,
         },
         url: {
            type: String,
         },
      },
      writer: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
