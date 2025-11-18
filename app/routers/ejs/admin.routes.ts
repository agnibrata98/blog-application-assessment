import express from 'express';
import { adminController } from '../../controllers/ejs/admin.controller';
import { verifyAdminToken } from '../../middleware/VerifyRoleToken';
import profileImageUpload from '../../helper/ProfileImageUpload';


const ejsAdminRouter=express.Router()

// for getting admin login page
ejsAdminRouter.get('/admin-dashboard', verifyAdminToken(), adminController.getAdminDashboardPage);

// get route for all user page
// ejsAdminRouter.get('/all-users', verifyAdminToken(), adminController.getAllUsersPage);

ejsAdminRouter.get("/users", verifyAdminToken(), adminController.getAllUsersPage);

// AJAX routes
ejsAdminRouter.get("/users/:id", adminController.getSingleUser);
ejsAdminRouter.post(
  "/users/update/:id",
  profileImageUpload.single("profileImage"),
  adminController.updateUser
);

// post method for register new technician
// ejsAdminRouter.post('/technician-register/submit', authController.registerTechnician);



export {ejsAdminRouter};