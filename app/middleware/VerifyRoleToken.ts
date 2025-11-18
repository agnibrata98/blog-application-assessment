import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../models/user.model";

dotenv.config();

// Extend Express request type
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload | any;
  }
}

/**
 * Middleware ONLY for admin authentication (EJS protected pages)
 */
export function verifyAdminToken() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies["adminToken"];

      if (!token) {
        req.flash("error", "Please log in as admin first.");
        return res.redirect("/auth/admin-login");
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error("❌ Missing ACCESS_SECRET in .env");
        req.flash("error", "Server configuration error.");
        return res.redirect("/auth/admin-login");
      }

      // Verify token
      const decoded = jwt.verify(token, secret) as JwtPayload;

      if (!decoded || !decoded.id) {
        req.flash("error", "Invalid token.");
        return res.redirect("/auth/admin-login");
      }

      // Fetch user from DB
      const admin = await UserModel.findById(decoded.id).lean();

      if (!admin) {
        req.flash("error", "Admin account not found.");
        return res.redirect("/auth/admin-login");
      }

      // Ensure user is ADMIN
      if (admin.role !== "admin") {
        req.flash("error", "Unauthorized access.");
        return res.redirect("/auth/admin-login");
      }

      // Attach user object for further use
      req.user = admin;

      next();
    } catch (err: any) {
      console.error("💥 Admin token verification error:", err.message);
      req.flash("error", "Session expired. Please log in again.");
      return res.redirect("/auth/admin-login");
    }
  };
}
