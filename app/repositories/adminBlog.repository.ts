import mongoose from "mongoose";
import { BlogModel } from "../models/blog.model";

class AdminBlogRepository {
  // Get all blogs with user details
  async getAllBlogs() {
    return BlogModel.aggregate([
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
  async getBlogById(id: string) {
    return BlogModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
  async updateBlog(id: string, payload: any) {
    return BlogModel.findByIdAndUpdate(id, payload, { new: true });
  }

  // Hard delete blog
  async deleteBlog(id: string) {
    return BlogModel.findByIdAndDelete(id);
  }
}

export const adminBlogRepository = new AdminBlogRepository();
