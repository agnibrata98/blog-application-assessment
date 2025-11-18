"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRepository = void 0;
const blog_model_1 = require("../models/blog.model");
const mongoose_1 = __importDefault(require("mongoose"));
class BlogRepository {
    // Create blog
    async createBlog(data) {
        return await blog_model_1.BlogModel.create(data);
    }
    // Get all blogs (not deleted)
    async getAllBlogs() {
        return await blog_model_1.BlogModel.aggregate([
            // Match only non-deleted blogs
            { $match: { isDeleted: false } },
            // Lookup user details
            {
                $lookup: {
                    from: "users", // MongoDB collection name
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
                }
            },
            // Unwind createdBy array
            { $unwind: "$createdBy" },
            // Choose which fields to show from user
            {
                $project: {
                    title: 1,
                    description: 1,
                    blogImage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "createdBy._id": 1,
                    "createdBy.name": 1,
                    "createdBy.email": 1
                }
            },
            // Sort blogs by date (newest first)
            { $sort: { createdAt: -1 } }
        ]);
    }
    // Get blog by ID (for update/delete check)
    async getBlogById(id) {
        return await blog_model_1.BlogModel.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(id),
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: "users", // MongoDB collection name
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
                }
            },
            { $unwind: "$createdBy" }, // convert array → object
            {
                $project: {
                    title: 1,
                    description: 1,
                    blogImage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "createdBy._id": 1,
                    "createdBy.name": 1,
                    "createdBy.email": 1
                }
            }
        ]);
    }
    // Update blog (only selected fields)
    async updateBlog(id, payload) {
        return await blog_model_1.BlogModel.findByIdAndUpdate(id, payload, { new: true });
    }
    // Soft delete
    async softDeleteBlog(id) {
        return await blog_model_1.BlogModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
}
exports.blogRepository = new BlogRepository();
