import express from "express";
import { registerUser, loginUser, getUserProfile, googleLogin } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/google-login', googleLogin);
userRouter.get('/profile', protect, getUserProfile);

//protected route as token will be required

export default userRouter;