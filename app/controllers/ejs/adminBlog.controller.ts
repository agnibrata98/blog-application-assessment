import { Request, Response } from "express";
import { adminBlogRepository } from "../../repositories/adminBlog.repository";

class AdminBlogController {
  async getAllBlogsPage(req: Request, res: Response) {
    try {
      const blogs = await adminBlogRepository.getAllBlogs();

      res.render("admin/blogs", {
        title: "Manage Blogs",
        blogs,
        data: req.user
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getSingleBlog(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const blog = await adminBlogRepository.getBlogById(id);

      if (!blog || blog.length === 0) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }

      return res.json({ success: true, blog: blog[0] });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error fetching blog" });
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const payload: any = {
        title: req.body.title,
        description: req.body.description
      };

      if (req.file) {
        payload.blogImage = req.file.path; // Cloudinary URL
      }

      const updated = await adminBlogRepository.updateBlog(id, payload);

      return res.json({
        success: true,
        message: "Blog updated successfully!",
        blog: updated
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Update failed" });
    }
  }

  async deleteBlog(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await adminBlogRepository.deleteBlog(id);

      return res.json({
        success: true,
        message: "Blog deleted permanently!"
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
  }
}

export const adminBlogController = new AdminBlogController();
