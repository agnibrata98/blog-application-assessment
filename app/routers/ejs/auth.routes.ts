import express from 'express';
import { authController } from '../../controllers/ejs/auth.controller';


const ejsAuthRouter=express.Router()

// for getting admin login page
ejsAuthRouter.get('/admin-login', authController.getLoginPage);

// post route for admin login
ejsAuthRouter.post('/admin-login/submit', authController.adminLogin);

// Logout Route
ejsAuthRouter.get("/logout", authController.logout);



export {ejsAuthRouter};