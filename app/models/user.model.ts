import { model, Schema, Types } from "mongoose";
import Joi from "joi";
import { UserInterface } from "../interface/user.interface";

//validation schema
export const UserSchemaValidate = Joi.object({
  name: Joi.string().required().min(3),
  email: Joi.string().required().email(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  profileImage: Joi.string().optional().allow(""),
  password: Joi.string().required().min(6),
  role: Joi.string().valid("admin", "user").default("user")
});

const UserSchema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      required: false,
      default: ""
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    }
  },
  { timestamps: true }
);

const UserModel = model<UserInterface>("User", UserSchema);

export { UserModel };
