"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserSchemaValidate = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
//validation schema
exports.UserSchemaValidate = joi_1.default.object({
    name: joi_1.default.string().required().min(3),
    email: joi_1.default.string().required().email(),
    phone: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    profileImage: joi_1.default.string().optional().allow(""),
    password: joi_1.default.string().required().min(6),
    role: joi_1.default.string().valid("admin", "user").default("user")
});
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.UserModel = UserModel;
