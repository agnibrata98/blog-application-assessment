"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepositories = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const jwtSecret = process.env.JWT_SECRET || "your_secret_key";
class AuthRepositories {
    /**
     * Register a new user
     */
    async registerUser(userData, profileImagePath) {
        const { name, email, phone, address, password } = userData;
        // Check existing user
        const existingUser = await user_model_1.UserModel.findOne({ email });
        if (existingUser) {
            return {
                success: false,
                statusCode: 409,
                message: "User already exists"
            };
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Save new user
        const newUser = new user_model_1.UserModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            profileImage: profileImagePath || "", // store uploaded image URL
        });
        await newUser.save();
        return {
            success: true,
            statusCode: 201,
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profileImage: newUser.profileImage
            }
        };
    }
    /**
     * Login an existing user
     */
    async loginUser(email, password) {
        // Find user by email
        const user = await user_model_1.UserModel.findOne({ email });
        if (!user) {
            return {
                success: false,
                statusCode: 404,
                message: "User not found"
            };
        }
        // Validate password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                statusCode: 401,
                message: "Invalid email or password"
            };
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: "1h" });
        return {
            success: true,
            statusCode: 200,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
}
const authRepositories = new AuthRepositories();
exports.authRepositories = authRepositories;
