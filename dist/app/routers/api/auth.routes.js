"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiAuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/api/auth.controller");
const ProfileImageUpload_1 = __importDefault(require("../../helper/ProfileImageUpload"));
const apiAuthRouter = express_1.default.Router();
exports.apiAuthRouter = apiAuthRouter;
// post route for user register api
apiAuthRouter.post('/register', ProfileImageUpload_1.default.single("profileImage"), auth_controller_1.authController.register);
// post route for user login api
apiAuthRouter.post('/login', auth_controller_1.authController.login);
