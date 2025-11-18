"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminBlogController = void 0;
const adminBlog_repository_1 = require("../../repositories/adminBlog.repository");
class AdminBlogController {
    async getAllBlogsPage(req, res) {
        try {
            const blogs = await adminBlog_repository_1.adminBlogRepository.getAllBlogs();
            res.render("admin/blogs", {
                title: "Manage Blogs",
                blogs,
                data: req.user
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async getSingleBlog(req, res) {
        try {
            const id = req.params.id;
            const blog = await adminBlog_repository_1.adminBlogRepository.getBlogById(id);
            if (!blog || blog.length === 0) {
                return res.status(404).json({ success: false, message: "Blog not found" });
            }
            return res.json({ success: true, blog: blog[0] });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Error fetching blog" });
        }
    }
    async updateBlog(req, res) {
        try {
            const id = req.params.id;
            const payload = {
                title: req.body.title,
                description: req.body.description
            };
            if (req.file) {
                payload.blogImage = req.file.path; // Cloudinary URL
            }
            const updated = await adminBlog_repository_1.adminBlogRepository.updateBlog(id, payload);
            return res.json({
                success: true,
                message: "Blog updated successfully!",
                blog: updated
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Update failed" });
        }
    }
    async deleteBlog(req, res) {
        try {
            const id = req.params.id;
            await adminBlog_repository_1.adminBlogRepository.deleteBlog(id);
            return res.json({
                success: true,
                message: "Blog deleted permanently!"
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Delete failed" });
        }
    }
}
exports.adminBlogController = new AdminBlogController();
