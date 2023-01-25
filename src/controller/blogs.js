const Blog = require("../models/blog");

// GET ALLL BLOGS
const getAllBlogs = (req, res) =>{
    try {
        Blog.find().then(response => {
            res.send(response)
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: []
        })
    }
}

// CREATE BLOG
const createBlog = (req, res) => {
    const formData = req.body;

    try {
        Blog.create(formData, function(err, data){
            if(err) res.status(400).json({
                status: false,
                message: err.message
            })

            res.send({
                status: true,
                message: "Blog created",
                data: data
            })
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: []
        })
    }
}

// GET BLOG BY ID
const getBlogById = (req, res) => {
    const id = req.params.id

    try {
        Blog.findById(id).then(data => {
            res.send(data)
        }).catch(err => {
            res.status(404).json({
                status: false,
                message: err.message
            })
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            data: []
        })
    }
}

const deleteBlog = (req, res) => {
    const id = req.params.id;

    try {
        Blog.findByIdAndDelete(id).then(() =>{
            res.status(200).json({
                status: true,
                message: "Blog has been deleted"
            })
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            mesage: error.message,
            data: []
        })
    }
}
module.exports = {
    getAllBlogs,
    createBlog,
    getBlogById,
    deleteBlog
}