import express from "express";
import { blogController } from "../../controllers/api/blog.controller";
import { verifyUserRoleToken } from "../../middleware/VerifyUserRoleToken";
import blogImageUpload from "../../helper/BlogImageUpload";

const blogRouter = express.Router();

// Create a new blog (login required)
blogRouter.post("/create", verifyUserRoleToken(['user']), blogImageUpload.single('blogImage'), blogController.createBlog);

// Get all blogs (public)
blogRouter.get("/all", blogController.getAllBlogs);

// get single blog details by id
blogRouter.get("/:id", blogController.getBlogById);

// Update a blog (owner only)
blogRouter.put("/:id", verifyUserRoleToken(['user']), blogImageUpload.single('blogImage'), blogController.updateBlog);

// Soft delete a blog (owner only)
blogRouter.delete("/:id", verifyUserRoleToken(['user']), blogController.deleteBlog);

export { blogRouter };
