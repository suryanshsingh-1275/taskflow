import express from "express";
import {
    createBoard,
    getBoards,
    getBoard,
    updateBoard,
    deleteBoard,
    inviteMember,
    removeMember
} from "../controllers/boardController.js";

import authMiddleware from "../middleware/authMiddleware.js";


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
    updateBoard
);


router.delete(
    "/:id",
    authMiddleware,
    deleteBoard
);




router.post(
    "/:id/members",
    authMiddleware,
    inviteMember
);


router.delete(
    "/:id/members/:memberId",
    authMiddleware,
    removeMember
);


export default router;