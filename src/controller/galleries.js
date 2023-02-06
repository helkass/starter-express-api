const Gallery = require("../models/gallery");

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
const createGallery = (req, res) => {
   const formData = req.body;

   try {
      Gallery.create(formData, function (err, data) {
         if (err) return res.status(400).json({ message: err.message });

         res.status(201).json(data);
      });
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
