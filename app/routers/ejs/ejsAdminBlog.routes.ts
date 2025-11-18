import express from "express";
import { adminBlogController } from "../../controllers/ejs/adminBlog.controller";
import blogImageUpload from "../../helper/BlogImageUpload";
import { verifyAdminToken } from "../../middleware/VerifyRoleToken";

const adminBlogRouter = express.Router();

// View all blogs
adminBlogRouter.get("/blogs", verifyAdminToken(), adminBlogController.getAllBlogsPage);

// Get single blog (AJAX)
adminBlogRouter.get("/blogs/:id", verifyAdminToken(), adminBlogController.getSingleBlog);

// Edit blog (AJAX + image upload)
adminBlogRouter.post(
  "/blogs/update/:id",
  verifyAdminToken(),
  blogImageUpload.single("blogImage"),
  adminBlogController.updateBlog
);

// Hard delete blog
adminBlogRouter.delete("/blogs/delete/:id", verifyAdminToken(), adminBlogController.deleteBlog);

export { adminBlogRouter };
