"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const user_model_1 = require("../../models/user.model");
const StatusCode_1 = require("../../helper/StatusCode");
const auth_repository_1 = require("../../repositories/auth.repository");
const jwtSecret = process.env.JWT_SECRET || "your_secret_key";
class AuthController {
    /**
     * Register Controller
     */
    async register(req, res) {
        try {
            const { error, value } = user_model_1.UserSchemaValidate.validate(req.body);
            if (error) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: error.details[0].message
                });
            }
            // Get Cloudinary file path
            const profileImagePath = req.file ? req.file.path : "";
            const result = await auth_repository_1.authRepositories.registerUser(value, profileImagePath);
            if (result.success) {
                return res
                    .status(result.statusCode)
                    .json({ success: true, message: result.message, user: result.user });
            }
            else {
                return res
                    .status(result.statusCode)
                    .json({ success: false, message: result.message });
            }
        }
        catch (error) {
            console.error("Register Error:", error);
            return res
                .status(StatusCode_1.StatusCode.SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    }
    /**
     * Login Controller
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(StatusCode_1.StatusCode.BAD_REQUEST)
                    .json({ success: false, message: "Email and password are required" });
            }
            const result = await auth_repository_1.authRepositories.loginUser(email, password);
            if (result.success) {
                return res.status(result.statusCode).json({
                    success: true,
                    message: result.message,
                    token: result.token,
                    user: result.user
                });
            }
            else {
                return res
                    .status(result.statusCode)
                    .json({ success: false, message: result.message });
            }
        }
        catch (error) {
            console.error("Login Error:", error);
            return res
                .status(StatusCode_1.StatusCode.SERVER_ERROR)
                .json({ success: false, message: "Internal server error" });
        }
    }
}
exports.authController = new AuthController();
