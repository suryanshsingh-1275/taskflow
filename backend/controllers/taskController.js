import Task from "../models/Task.js";
import Board from "../models/Board.js";


// ACCESS CHECK HELPER

const isOwnerOrMember = (board, userId) => {

    const isOwner = board.owner.toString() === userId.toString();

    const isMember = board.members.some(
        (memberId) => memberId.toString() === userId.toString()
    );

    return isOwner || isMember;

};


// CREATE TASK

export const createTask = async (req, res) => {

    try {

        const {
            title,
            description,
            priority,
            dueDate,
            assignee,
            board,
            column
        } = req.body;


        if (!title || !board) {

            return res.status(400).json({
                message: "Title and board are required"
            });

        }


        const boardDoc = await Board.findById(board);

        if (!boardDoc) {

            return res.status(404).json({
                message: "Board not found"
            });

        }

        if (!isOwnerOrMember(boardDoc, req.user.userId)) {

            return res.status(403).json({
                message: "You do not have access to this board"
            });

        }


        
        if (assignee) {

            const assigneeIsOwner = boardDoc.owner.toString() === assignee;

            const assigneeIsMember = boardDoc.members.some(
                (memberId) => memberId.toString() === assignee
            );

            if (!assigneeIsOwner && !assigneeIsMember) {

                return res.status(400).json({
                    message: "Assignee must be a member of this board"
                });

            }

        }


        const task = await Task.create({

            title,

            description: description || "",

            priority: priority || "Medium",

            dueDate: dueDate || null,

            assignee: assignee || null,

            board,

            column: column || "todo",

            createdBy: req.user.userId

        });


        res.status(201).json({

            message: "Task created successfully",

            task

        });

    } catch (error) {

        console.error("Create Task Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};



// GET TASKS OF A BOARD

export const getBoardTasks = async (req, res) => {

    try {

        const { boardId } = req.params;


        const boardDoc = await Board.findById(boardId);

        if (!boardDoc) {

            return res.status(404).json({
                message: "Board not found"
            });

        }

        if (!isOwnerOrMember(boardDoc, req.user.userId)) {

            return res.status(403).json({
                message: "You do not have access to this board"
            });

        }


        const tasks = await Task.find({

            board: boardId

        }).sort({

            createdAt: -1

        });


        res.status(200).json({

            tasks

        });

    } catch (error) {

        console.error("Get Tasks Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};



// GET MY TASKS  (GET /api/tasks/calendar)


export const getMyTasks = async (req, res) => {

    try {

        const boards = await Board.find({
            $or: [
                { owner: req.user.userId },
                { members: req.user.userId }
            ]
        }).select("_id");

        const boardIds = boards.map(
            (board) => board._id
        );

        const tasks = await Task.find({

            board: { $in: boardIds },

            dueDate: { $ne: null }

        }).sort({

            dueDate: 1

        });


        res.status(200).json({

            tasks

        });

    } catch (error) {

        console.error("Get My Tasks Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};



// GET SINGLE TASK

export const getTask = async (req, res) => {

    try {

        const { id } = req.params;


        const task = await Task.findById(id);


        if (!task) {

            return res.status(404).json({
                message: "Task not found"
            });

        }


        const boardDoc = await Board.findById(task.board);

        if (!boardDoc || !isOwnerOrMember(boardDoc, req.user.userId)) {

            return res.status(403).json({
                message: "You do not have access to this task"
            });

        }


        res.status(200).json({

            task

        });

    } catch (error) {

        console.error("Get Task Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};



// UPDATE TASK

export const updateTask = async (req, res) => {

    try {

        const { id } = req.params;


        const task = await Task.findById(id);

        if (!task) {

            return res.status(404).json({
                message: "Task not found"
            });

        }


        const boardDoc = await Board.findById(task.board);

        if (!boardDoc || !isOwnerOrMember(boardDoc, req.user.userId)) {

            return res.status(403).json({
                message: "You do not have access to this task"
            });

        }


        const {
            title,
            description,
            priority,
            dueDate,
            assignee,
            column
        } = req.body;


        if (assignee) {

            const assigneeIsOwner = boardDoc.owner.toString() === assignee;

            const assigneeIsMember = boardDoc.members.some(
                (memberId) => memberId.toString() === assignee
            );

            if (!assigneeIsOwner && !assigneeIsMember) {

                return res.status(400).json({
                    message: "Assignee must be a member of this board"
                });

            }

        }


        const updates = {};

        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (priority !== undefined) updates.priority = priority;
        if (dueDate !== undefined) updates.dueDate = dueDate;
        if (assignee !== undefined) updates.assignee = assignee;
        if (column !== undefined) updates.column = column;


        const updatedTask = await Task.findByIdAndUpdate(

            id,

            updates,

            {
                new: true,
                runValidators: true
            }

        );


        res.status(200).json({

            message: "Task updated successfully",

            task: updatedTask

        });

    } catch (error) {

        console.error("Update Task Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};



// DELETE TASK

export const deleteTask = async (req, res) => {

    try {

        const { id } = req.params;


        const task = await Task.findById(id);

        if (!task) {

            return res.status(404).json({
                message: "Task not found"
            });

        }


        const boardDoc = await Board.findById(task.board);

        if (!boardDoc || !isOwnerOrMember(boardDoc, req.user.userId)) {

            return res.status(403).json({
                message: "You do not have access to this task"
            });

        }


        await Task.findByIdAndDelete(id);


        res.status(200).json({

            message: "Task deleted successfully"

        });

    } catch (error) {

        console.error("Delete Task Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};