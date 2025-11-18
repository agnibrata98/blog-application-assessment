"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = exports.BlogSchemaValidate = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
//validation schema
exports.BlogSchemaValidate = joi_1.default.object({
    title: joi_1.default.string().required().min(3),
    description: joi_1.default.string().required().min(5),
    blogImage: joi_1.default.string().optional().allow(""),
    isDeleted: joi_1.default.boolean().default(false)
});
const BlogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    blogImage: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const BlogModel = (0, mongoose_1.model)("Blog", BlogSchema);
exports.BlogModel = BlogModel;
