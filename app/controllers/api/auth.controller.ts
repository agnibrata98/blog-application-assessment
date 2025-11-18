import { Request, Response } from "express";
import { UserModel, UserSchemaValidate } from "../../models/user.model";
import { StatusCode } from "../../helper/StatusCode";
import { authRepositories } from "../../repositories/auth.repository";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your_secret_key";

class AuthController {
  /**
   * Register Controller
   */
  async register(req: Request, res: Response): Promise<any> {
    try {
      const { error, value } = UserSchemaValidate.validate(req.body);
      if (error) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: error.details[0].message
        });
      }

      // Get Cloudinary file path
      const profileImagePath = req.file ? (req.file as any).path : "";

      const result = await authRepositories.registerUser(
        value,
        profileImagePath
      );

      if (result.success) {
        return res
          .status(result.statusCode)
          .json({ success: true, message: result.message, user: result.user });
      } else {
        return res
          .status(result.statusCode)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Register Error:", error);
      return res
        .status(StatusCode.SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  /**
   * Login Controller
   */
  async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ success: false, message: "Email and password are required" });
      }

      const result = await authRepositories.loginUser(email, password);

      if (result.success) {
        return res.status(result.statusCode).json({
          success: true,
          message: result.message,
          token: result.token,
          user: result.user
        });
      } else {
        return res
          .status(result.statusCode)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Login Error:", error);
      return res
        .status(StatusCode.SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export const authController = new AuthController();
