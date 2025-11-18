"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = verifyAdminToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
/**
 * Middleware ONLY for admin authentication (EJS protected pages)
 */
function verifyAdminToken() {
    return async (req, res, next) => {
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
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (!decoded || !decoded.id) {
                req.flash("error", "Invalid token.");
                return res.redirect("/auth/admin-login");
            }
            // Fetch user from DB
            const admin = await user_model_1.UserModel.findById(decoded.id).lean();
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
        }
        catch (err) {
            console.error("💥 Admin token verification error:", err.message);
            req.flash("error", "Session expired. Please log in again.");
            return res.redirect("/auth/admin-login");
        }
    };
}
