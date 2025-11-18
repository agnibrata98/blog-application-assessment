"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userManagementRepository = void 0;
const user_model_1 = require("../models/user.model");
class UserManagementRepository {
    async getAllUsers() {
        return await user_model_1.UserModel.find();
    }
    async getUserById(id) {
        return await user_model_1.UserModel.findById(id);
    }
    async updateUser(id, payload) {
        return await user_model_1.UserModel.findByIdAndUpdate(id, payload, { new: true });
    }
}
exports.userManagementRepository = new UserManagementRepository();
