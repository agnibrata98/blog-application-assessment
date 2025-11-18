import { BlogModel } from "../models/blog.model";
import { BlogInterface } from "../interface/blog.interface";
import mongoose, { Types } from "mongoose";

class BlogRepository {
  // Create blog
  async createBlog(data: BlogInterface) {
    return await BlogModel.create(data);
  }

  // Get all blogs (not deleted)
  async getAllBlogs() {
    return await BlogModel.aggregate([
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
  async getBlogById(id: string) {
    return await BlogModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
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
  async updateBlog(id: string, payload: Partial<BlogInterface>) {
    return await BlogModel.findByIdAndUpdate(id, payload, { new: true });
  }

  // Soft delete
  async softDeleteBlog(id: string) {
    return await BlogModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}

export const blogRepository = new BlogRepository();
