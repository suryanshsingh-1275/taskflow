import express from "express";
import {
    signup,
    login
} from "../controllers/authController.js";



router.post("/signup", signup);


router.post("/login", login);


const router = express.Router();

export default router;