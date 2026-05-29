import express from "express";
import { checkAuth, signup, login,updateProfile, deleteprofilepic, deleteUser } from "../controllers/userController.js";
import {protectRoute} from "../middleware/auth.js";
const userRouter=express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.put("/update-profile",protectRoute ,updateProfile);
userRouter.get("/check",protectRoute,updateProfile,checkAuth);
// routes/userRoutes.js
userRouter.put("/delete-profile-pic", protectRoute, deleteprofilepic);

userRouter.delete('/:userId', deleteUser);
export default userRouter;