"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminBlogRouter = void 0;
const express_1 = __importDefault(require("express"));
const adminBlog_controller_1 = require("../../controllers/ejs/adminBlog.controller");
const BlogImageUpload_1 = __importDefault(require("../../helper/BlogImageUpload"));
const VerifyRoleToken_1 = require("../../middleware/VerifyRoleToken");
const adminBlogRouter = express_1.default.Router();
exports.adminBlogRouter = adminBlogRouter;
// View all blogs
adminBlogRouter.get("/blogs", (0, VerifyRoleToken_1.verifyAdminToken)(), adminBlog_controller_1.adminBlogController.getAllBlogsPage);
// Get single blog (AJAX)
adminBlogRouter.get("/blogs/:id", (0, VerifyRoleToken_1.verifyAdminToken)(), adminBlog_controller_1.adminBlogController.getSingleBlog);
// Edit blog (AJAX + image upload)
adminBlogRouter.post("/blogs/update/:id", (0, VerifyRoleToken_1.verifyAdminToken)(), BlogImageUpload_1.default.single("blogImage"), adminBlog_controller_1.adminBlogController.updateBlog);
// Hard delete blog
adminBlogRouter.delete("/blogs/delete/:id", (0, VerifyRoleToken_1.verifyAdminToken)(), adminBlog_controller_1.adminBlogController.deleteBlog);
