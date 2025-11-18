"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ejsAuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/ejs/auth.controller");
const ejsAuthRouter = express_1.default.Router();
exports.ejsAuthRouter = ejsAuthRouter;
// for getting admin login page
ejsAuthRouter.get('/admin-login', auth_controller_1.authController.getLoginPage);
// post route for admin login
ejsAuthRouter.post('/admin-login/submit', auth_controller_1.authController.adminLogin);
// Logout Route
ejsAuthRouter.get("/logout", auth_controller_1.authController.logout);
