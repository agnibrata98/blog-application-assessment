import { model, Schema, Types } from "mongoose";
import Joi from "joi";
import { BlogInterface } from "../interface/blog.interface";

//validation schema
export const BlogSchemaValidate = Joi.object({
  title: Joi.string().required().min(3),
  description: Joi.string().required().min(5),
  blogImage: Joi.string().optional().allow(""),
  isDeleted: Joi.boolean().default(false)
});

const BlogSchema = new Schema<BlogInterface>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    blogImage: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const BlogModel = model<BlogInterface>("Blog", BlogSchema);

export { BlogModel };
