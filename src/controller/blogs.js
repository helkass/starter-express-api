const Blog = require("../models/blog");

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
const createBlog = (req, res) => {
   const formData = req.body;

   try {
      Blog.create(formData, function (err, data) {
         if (err) {
            res.status(400).json({ message: "something went wrong!" });
         } else {
            res.status(201).json(data);
         }
      });
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
