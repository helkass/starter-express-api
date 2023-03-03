const Blog = require("../models/blog");
const cloudinary = require("../config/cloudinary");

// GET ALLL BLOGS
const getAllBlogs = async (req, res) => {
   try {
      const blogs = await Blog.find();
      res.json(blogs);
   } catch (error) {
      res.status(500).json({ message: "something went wrong!" });
   }
};

// CREATE BLOG
const createBlog = async (req, res) => {
   const formData = req.body;

   try {
      const handleImage = await cloudinary.uploader.upload(form.image, {
         folder: "products",
         width: 200,
         height: 220,
         crop: "scale",
      });
      Blog.create(
         {
            title: formData.title,
            article: formData.article,
            image: {
               public_id: handleImage.public_id,
               url: handleImage.url,
            },
            writer: formData.writer,
         },
         function (err, data) {
            if (err) {
               res.status(400).json({ message: "something went wrong!" });
            } else {
               res.status(201).json(data);
            }
         }
      );
   } catch (error) {
      res.status(500).json({ message: "something went wrong!" });
   }
};

// GET BLOG BY ID
const getBlogById = async (req, res) => {
   const id = req.params.id;

   try {
      const blog = await Blog.findById(id);
      res.status(200).json(blog);
   } catch (error) {
      res.status(500).json({ message: "something went wrong!" });
   }
};

const deleteBlog = async (req, res) => {
   const id = req.params.id;

   try {
      await Blog.findByIdAndDelete(id);
      res.json({ message: "Delete successfully!" });
   } catch (error) {
      res.status(500).json({ message: "something went wrong!" });
   }
};
module.exports = {
   getAllBlogs,
   createBlog,
   getBlogById,
   deleteBlog,
};
