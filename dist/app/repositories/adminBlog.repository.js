"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminBlogRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const blog_model_1 = require("../models/blog.model");
class AdminBlogRepository {
    // Get all blogs with user details
    async getAllBlogs() {
        return blog_model_1.BlogModel.aggregate([
            { $match: {} }, // include deleted also
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    title: 1,
                    description: 1,
                    blogImage: 1,
                    isDeleted: 1,
                    createdAt: 1,
                    "user.name": 1,
                    "user.email": 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
    }
    // Get single blog
    async getBlogById(id) {
        return blog_model_1.BlogModel.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" }
        ]);
    }
    // Admin edit blog (with or without image)
    async updateBlog(id, payload) {
        return blog_model_1.BlogModel.findByIdAndUpdate(id, payload, { new: true });
    }
    // Hard delete blog
    async deleteBlog(id) {
        return blog_model_1.BlogModel.findByIdAndDelete(id);
    }
}
exports.adminBlogRepository = new AdminBlogRepository();
