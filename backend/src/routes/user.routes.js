import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  updateProfile,
  uploadProfileImage,
} from "../controllers/user.controller.js";
import upload from "../middlewares/upload.middleware.js";

const userRouter = express.Router();

userRouter.get("/me", protect, getCurrentUser);
userRouter.patch("/profile", protect, updateProfile);
userRouter.patch(
  "/profile-image",
  protect,
  upload.single("image"),
  uploadProfileImage,
);

export default userRouter;
