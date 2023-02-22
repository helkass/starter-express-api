const Item = require("../models/item");
const cloudinary = require("../config/cloudinary");

// CREATE ITEM
const createItem = async (req, res) => {
   const { title, desc, img, medium, large, size, price, type } = req.body;

   try {
      const handleImage = await cloudinary.uploader.upload(img, {
         folder: "products",
         // width: 250,
         // crop: "scale"
      });
      Item.create(
         {
            title,
            desc,
            img: {
               public_id: handleImage.public_id,
               urlImage: handleImage.secure_url,
            },
            medium,
            large,
            size,
            price,
            type,
         },
         function (err, data) {
            if (err)
               res.status(400).json({
                  status: false,
                  message: err.message,
               });
            res.status(201).json(data);
         }
      );
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

// GET ITEMS
const getAllItems = async (req, res) => {
   const qType = req.query.type;
   try {
      let items;
      if (qType) {
         items = await Item.find({
            type: {
               $in: [qType],
            },
         });
      } else {
         items = await Item.find();
      }
      res.json(items);
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

// UPDATE || EDIT
const editItem = async (req, res) => {
   const id = req.params.id;
   const newData = req.body;
   try {
      const response = await Item.findByIdAndUpdate(id, newData);
      res.json(response);
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

// GET BLOG BY ID
const getItemById = async (req, res) => {
   const id = req.params.id;

   try {
      const item = await Item.findById(id);
      res.status(200).json(item);
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

const deleteItem = async (req, res) => {
   const id = req.params.id;

   try {
      await Item.findByIdAndDelete(id);
      res.json({ message: "Delete successfully!" });
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

module.exports = {
   createItem,
   getAllItems,
   getItemById,
   deleteItem,
   editItem,
};
