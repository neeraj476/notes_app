import {Router} from 'express'
import { userLogIn, userProfile, userSignUp ,userLogOut } from '../controller/user.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();




router.post("/register" , userSignUp);
router.post("/login" , userLogIn);
router.get("/logout" , userLogOut);
router.get("/profile",authenticateUser , userProfile);
router.get("/verify", authenticateUser, (req, res) => {
    res.status(200).json({ message: "User verified" }); // API to verify token for frontend
  });




export default router;