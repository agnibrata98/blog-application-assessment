"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("../../controllers/api/blog.controller");
const VerifyUserRoleToken_1 = require("../../middleware/VerifyUserRoleToken");
const BlogImageUpload_1 = __importDefault(require("../../helper/BlogImageUpload"));
const blogRouter = express_1.default.Router();
exports.blogRouter = blogRouter;
// Create a new blog (login required)
blogRouter.post("/create", (0, VerifyUserRoleToken_1.verifyUserRoleToken)(['user']), BlogImageUpload_1.default.single('blogImage'), blog_controller_1.blogController.createBlog);
// Get all blogs (public)
blogRouter.get("/all", blog_controller_1.blogController.getAllBlogs);
// get single blog details by id
blogRouter.get("/:id", blog_controller_1.blogController.getBlogById);
// Update a blog (owner only)
blogRouter.put("/:id", (0, VerifyUserRoleToken_1.verifyUserRoleToken)(['user']), BlogImageUpload_1.default.single('blogImage'), blog_controller_1.blogController.updateBlog);
// Soft delete a blog (owner only)
blogRouter.delete("/:id", (0, VerifyUserRoleToken_1.verifyUserRoleToken)(['user']), blog_controller_1.blogController.deleteBlog);
