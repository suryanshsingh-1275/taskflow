import express from "express";
import {
    signup,
    login
} from "../controllers/AnalyticsController/Controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAnalytics } from "../controllers/AnalyticsController.js";


const router = express.Router();

router.post("/analytics",
    authMiddleware,
    getAnalytics);

export default router;