import { Request, Response } from "express";
import { blogRepository } from "../../repositories/blog.repository";
import { BlogSchemaValidate } from "../../models/blog.model";
import mongoose from "mongoose";

class BlogController {
  // Create blog
  async createBlog(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      const blogImage = req.file ? req.file.path : null;
      const { title, description } = req.body;

      const validate = BlogSchemaValidate.validate({
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

      const blog = await blogRepository.createBlog({
        title,
        description,
        blogImage: blogImage || "",
        createdBy: userId,
        isDeleted: false
      });

      return res.status(201).json({ success: true, blog });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Read all blogs
  async getAllBlogs(req: Request, res: Response) {
    try {
      const blogs = await blogRepository.getAllBlogs();
      return res.status(200).json({ success: true, blogs });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Get single blog by ID
  async getBlogById(req: Request, res: Response) {
    try {
      const blogId = req.params.id;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blog ID format"
        });
      }

      const blog = await blogRepository.getBlogById(blogId);

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
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }

  // Update blog
  async updateBlog(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const blogId = req.params.id;

      // Aggregation always returns an array
      const blogArray = await blogRepository.getBlogById(blogId);
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
      const updatedPayload: any = {
        title: req.body.title || blog.title,
        description: req.body.description || blog.description
      };

      // If a new image is uploaded & validated
      if (req.file) {
        updatedPayload.blogImage = (req.file as any).path;
      }

      const updated = await blogRepository.updateBlog(blogId, updatedPayload);

      return res.status(200).json({
        success: true,
        message: "Blog updated",
        blog: updated
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Soft delete blog
  async deleteBlog(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const blogId = req.params.id;

      const blogArray = await blogRepository.getBlogById(blogId);
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

      await blogRepository.softDeleteBlog(blogId);

      return res.status(200).json({
        success: true,
        message: "Blog deleted"
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export const blogController = new BlogController();
