"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const blog_repository_1 = require("../../repositories/blog.repository");
const blog_model_1 = require("../../models/blog.model");
const mongoose_1 = __importDefault(require("mongoose"));
class BlogController {
    // Create blog
    async createBlog(req, res) {
        try {
            const userId = req.user.id;
            const blogImage = req.file ? req.file.path : null;
            const { title, description } = req.body;
            const validate = blog_model_1.BlogSchemaValidate.validate({
                title,
                description,
                blogImage: blogImage
            });
            if (validate.error) {
                return res.status(400).json({
                    success: false,
                    message: validate.error.message
                });
            }
            const blog = await blog_repository_1.blogRepository.createBlog({
                title,
                description,
                blogImage: blogImage || "",
                createdBy: userId,
                isDeleted: false
            });
            return res.status(201).json({ success: true, blog });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
    // Read all blogs
    async getAllBlogs(req, res) {
        try {
            const blogs = await blog_repository_1.blogRepository.getAllBlogs();
            return res.status(200).json({ success: true, blogs });
        }
        catch (err) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
    // Get single blog by ID
    async getBlogById(req, res) {
        try {
            const blogId = req.params.id;
            // Validate ObjectId
            if (!mongoose_1.default.Types.ObjectId.isValid(blogId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid blog ID format"
                });
            }
            const blog = await blog_repository_1.blogRepository.getBlogById(blogId);
            if (!blog || blog.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found"
                });
            }
            return res.status(200).json({
                success: true,
                blog: blog[0] // aggregation returns an array
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
    // Update blog
    async updateBlog(req, res) {
        try {
            const userId = req.user.id;
            const blogId = req.params.id;
            // Aggregation always returns an array
            const blogArray = await blog_repository_1.blogRepository.getBlogById(blogId);
            const blog = blogArray[0];
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found"
                });
            }
            // Check owner
            if (blog.createdBy._id.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            // Build update payload
            const updatedPayload = {
                title: req.body.title || blog.title,
                description: req.body.description || blog.description
            };
            // If a new image is uploaded & validated
            if (req.file) {
                updatedPayload.blogImage = req.file.path;
            }
            const updated = await blog_repository_1.blogRepository.updateBlog(blogId, updatedPayload);
            return res.status(200).json({
                success: true,
                message: "Blog updated",
                blog: updated
            });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
    // Soft delete blog
    async deleteBlog(req, res) {
        try {
            const userId = req.user.id;
            const blogId = req.params.id;
            const blogArray = await blog_repository_1.blogRepository.getBlogById(blogId);
            const blog = blogArray[0];
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found"
                });
            }
            if (blog.createdBy._id.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            await blog_repository_1.blogRepository.softDeleteBlog(blogId);
            return res.status(200).json({
                success: true,
                message: "Blog deleted"
            });
        }
        catch (err) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
}
exports.blogController = new BlogController();
