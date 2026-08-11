import express from "express";
import {
    createBoard,
    getBoards,
    getBoard,
    updateBoard,
    deleteBoard
} from "../controllers/boardController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";


const router = express.Router();


router.post(
    "/",
    authMiddleware,
    createBoard
);


router.get(
    "/",
    authMiddleware,
    getBoards
);


router.get(
    "/:id",
    authMiddleware,
    getBoard
);


router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateBoard
);


router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteBoard
);


export default router;