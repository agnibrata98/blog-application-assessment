import { Request, Response } from "express";
import { UserModel } from "../../models/user.model";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  async getLoginPage(req: Request, res: Response) {
    try {
      res.render("admin/login", {
        title: "Admin Login Page",
        success: req.flash("success"),
        error: req.flash("error")
      });
    } catch (error) {
      console.log(error);
    }
  }

  //   async adminLogin(req: Request, res: Response) {
  //     try {
  //       const { email, password } = req.body;

  //       // Validate input
  //       if (!email || !password) {
  //         req.flash("error", "Email and password are required.");
  //         return res.redirect(req.originalUrl);
  //       }

  //       // Find user
  //       const user = await UserModel.findOne({ email });
  //       if (!user) {
  //         req.flash("error", "User not found.");
  //         return res.redirect('/auth/admin-login');
  //       }

  //       // Check if user role is allowed (admin, manager, technician)
  //       const allowedRoles = ["admin"];
  //       if (!allowedRoles.includes(user.role)) {
  //         req.flash("error", "Access denied. You are not authorized staff.");
  //         return res.redirect('/auth/admin-login');
  //       }

  //       // Check password
  //       const isMatch = await bcrypt.compare(password, user.password);
  //       if (!isMatch) {
  //         req.flash("error", "Invalid credentials.");
  //         return res.redirect('/auth/admin-login');
  //       }

  //       // Generate token
  //       const token = jwt.sign(
  //         {
  //           id: user._id,
  //           name: user.name,
  //           email: user.email,
  //           role: user.role,
  //           profileImage: user.profileImage
  //         },
  //         process.env.JWT_SECRET,
  //         { expiresIn: "1d" }
  //       );

  //       // Set cookie and redirect based on role
  //       let cookieName = "";
  //       let redirectURL = "";

  //       switch (user.role) {
  //         case "admin":
  //           cookieName = "adminToken";
  //           redirectURL = "/admin-dashboard";
  //           break;
  //       }

  //       res.cookie(cookieName, token, {
  //         httpOnly: true,
  //         secure: process.env.NODE_ENV === "production",
  //         sameSite: "lax",
  //         maxAge: 24 * 60 * 60 * 1000
  //       });

  //       return res.redirect(redirectURL);
  //     } catch (error) {
  //       console.error("Staff Login Error:", error);
  //       req.flash("error", "Something went wrong. Please try again later.");
  //       return res.redirect('/auth/admin-login');
  //     }
  //   }

  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        req.flash("error", "Email and password are required.");
        return res.redirect("/auth/admin-login");
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/auth/admin-login");
      }

      if (user.role !== "admin") {
        req.flash("error", "Access denied.");
        return res.redirect("/auth/admin-login");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash("error", "Invalid credentials.");
        return res.redirect("/auth/admin-login");
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
      });

      // Correct redirect
      return res.redirect("/admin-dashboard");
    } catch (error) {
      console.error("Admin Login Error:", error);
      req.flash("error", "Something went wrong. Try again.");
      return res.redirect("/auth/admin-login");
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // Destroy session
      req.session.destroy(err => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.redirect("/admin-dashboard");
        }

        // Clear session cookie
        res.clearCookie("connect.sid", {
          httpOnly: true,
          sameSite: "lax"
        });

        // Clear admin token cookie
        res.clearCookie("adminToken", {
          httpOnly: true,
          sameSite: "lax"
        });

        // Redirect to admin login
        return res.redirect("/auth/admin-login");
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.redirect("/admin-dashboard");
    }
  }
}

export const authController = new AuthController();
