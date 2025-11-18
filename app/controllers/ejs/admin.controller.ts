import { Request, Response } from "express";
import { userManagementRepository } from "../../repositories/userManagement.repository";

class AdminController {
  async getAdminDashboardPage(req: Request, res: Response) {
    try {
        console.log(req.user);
      res.render("admin/admin-dashboard", {
        title: "Admin dashboard",
        data: req.user
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUsersPage(req: Request, res: Response) {
    try {
      const users = await userManagementRepository.getAllUsers();
      console.log(req.user);

      res.render("admin/users", {
        title: "Manage Users",
        users,
        data: req.user
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getSingleUser(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const user = await userManagementRepository.getUserById(id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const payload: any = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        role: req.body.role
      };

      if (req.file) {
        payload.profileImage = req.file.path; // Cloudinary URL
      }

      const updated = await userManagementRepository.updateUser(id, payload);

      return res.json({
        success: true,
        message: "User updated successfully",
        user: updated
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user"
      });
    }
  }
}

export const adminController = new AdminController();
