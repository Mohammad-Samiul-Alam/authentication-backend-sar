import express, { Router } from "express";
import { forgotPassword, loginUser, registerUser, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:resetToken", resetPassword)


export default router;