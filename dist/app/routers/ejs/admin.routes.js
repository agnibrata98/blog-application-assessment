"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ejsAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../../controllers/ejs/admin.controller");
const VerifyRoleToken_1 = require("../../middleware/VerifyRoleToken");
const ProfileImageUpload_1 = __importDefault(require("../../helper/ProfileImageUpload"));
const ejsAdminRouter = express_1.default.Router();
exports.ejsAdminRouter = ejsAdminRouter;
// for getting admin login page
ejsAdminRouter.get('/admin-dashboard', (0, VerifyRoleToken_1.verifyAdminToken)(), admin_controller_1.adminController.getAdminDashboardPage);
// get route for all user page
// ejsAdminRouter.get('/all-users', verifyAdminToken(), adminController.getAllUsersPage);
ejsAdminRouter.get("/users", (0, VerifyRoleToken_1.verifyAdminToken)(), admin_controller_1.adminController.getAllUsersPage);
// AJAX routes
ejsAdminRouter.get("/users/:id", admin_controller_1.adminController.getSingleUser);
ejsAdminRouter.post("/users/update/:id", ProfileImageUpload_1.default.single("profileImage"), admin_controller_1.adminController.updateUser);
