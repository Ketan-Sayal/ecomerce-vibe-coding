import express from "express";
import { signup, signin, getCurrentUser, updateProfile, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/signin", signin);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.post("/logout", authMiddleware, logout);

export default router;
