import express from "express";
import {
    createTask,
    getBoardTasks,
    getTask,
    updateTask,
    deleteTask
} from "../controllers/taskController.js";




const router = express.Router();

router.post("/", createTask);

router.get("/board/:boardId", getBoardTasks);

router.get("/:id", getTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);




export default router;

