import express from "express";
import {
    signup,
    login
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";



router.post("/signup",
    authMiddleware,
    signup);


router.post("/login",
    authMiddleware,
    login);


const router = express.Router();

export default router;