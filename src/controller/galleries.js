const Gallery = require("../models/gallery");
const cloudinary = require("../config/cloudinary");

// GET ALL GALLERIES
const getAllGalleries = async (req, res) => {
   try {
      const galleries = await Gallery.find();

      res.json(galleries);
   } catch (error) {
      res.status(500).json({
         message: "Somthing wenty wrong!",
      });
   }
};

// CREATE
const createGallery = async (req, res) => {
   const formData = req.body;
   
   try {
      const handleImage = await cloudinary.uploader.upload(formData.image, {
         folder: "gallery",
         width: 200,
         height: 220,
       crop: "scale",
	});
      const response = await Gallery.create(
         {
            title: formData.title,
            desc: formData.desc,
            writer: formData.writer,
            image: { public_id: handleImage?.public_id, url: handleImage.url },
		},
	);
	  
	  res.status(201).json({status: true, data: response, message: "gallery has been uploaded!"})
   } catch (error) {
      res.status(500).json({ message: "Something went Wrong!" });
	}
};

// GET BLOG BY ID
const getGalleryById = async (req, res) => {
   const id = req.params.id;

   try {
      const gallery = await Gallery.findById(id);
      res.status(200).json(gallery);
   } catch (error) {
      res.status(500).json({ message: "something went wrong!" });
   }
};

const deleteGallery = async (req, res) => {
   const id = req.params.id;

   try {
      const gallery = await Gallery.findByIdAndDelete(id);
      res.json({ message: "Deelete successfully!" });
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};
module.exports = {
   getAllGalleries,
   createGallery,
   getGalleryById,
   deleteGallery,
};
