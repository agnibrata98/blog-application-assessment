import { Types } from "mongoose";

export interface BlogInterface {
  title: string;
  description: string;
  blogImage?: string;
  isDeleted: boolean;
  createdBy: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}
