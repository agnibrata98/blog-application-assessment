import express from 'express';
import { authController } from '../../controllers/api/auth.controller';
import profileImageUpload from '../../helper/ProfileImageUpload';


const apiAuthRouter=express.Router()

// post route for user register api
apiAuthRouter.post('/register', profileImageUpload.single("profileImage"), authController.register);

// post route for user login api
apiAuthRouter.post('/login', authController.login);

// post method for register new technician
// apiAuthRouter.post('/technician-register/submit', authController.registerTechnician);



export {apiAuthRouter};