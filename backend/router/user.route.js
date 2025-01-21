import {Router} from 'express'
import { userLogIn, userProfile, userSignUp } from '../controller/user.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();




router.post("/register" , userSignUp);
router.post("/login" , userLogIn);
router.get("/profile",authenticateUser , userProfile);




export default router;