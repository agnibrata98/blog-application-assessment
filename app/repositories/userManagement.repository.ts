import { UserModel } from "../models/user.model";

class UserManagementRepository {
  async getAllUsers() {
    return await UserModel.find();
  }

  async getUserById(id: string) {
    return await UserModel.findById(id);
  }

  async updateUser(id: string, payload: any) {
    return await UserModel.findByIdAndUpdate(id, payload, { new: true });
  }
}

export const userManagementRepository = new UserManagementRepository();
