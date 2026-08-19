import express from "express";
import {
    getBoardMessages,
    uploadAttachment
} from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();


router.get(
    "/board/:boardId",
    authMiddleware,
    getBoardMessages
);


router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    uploadAttachment
);


export default router;