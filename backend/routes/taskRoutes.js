import express from "express";
import {
    createTask,
    getBoardTasks,
    getTask,
    updateTask,
    deleteTask,
    getMyTasks
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";




const router = express.Router();

router.post("/",
    authMiddleware,
    createTask);

router.get("/board/:boardId", 
    authMiddleware,
    getBoardTasks);

router.get("/:id",
    authMiddleware,
    getTask);

router.put("/:id",
    authMiddleware,
    updateTask);

router.delete("/:id",
    authMiddleware,
     deleteTask);

router.get("/calendar",
    authMiddleware,
    getMyTasks);





export default router;

