import Task from "../models/Task.js";


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



// 
// GET TASKS OF A BOARD

export const getBoardTasks = async (req, res) => {

    try {

        const { boardId } = req.params;


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



// 
// GET SINGLE TASK
// 

export const getTask = async (req, res) => {

    try {

        const { id } = req.params;


        const task = await Task.findById(id);


        if (!task) {

            return res.status(404).json({
                message: "Task not found"
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


        const {
            title,
            description,
            priority,
            dueDate,
            assignee,
            status
        } = req.body;


        const task = await Task.findByIdAndUpdate(

            id,

            {
                title,
                description,
                priority,
                dueDate,
                assignee,
                status
            },

            {
                new: true,
                runValidators: true
            }

        );


        if (!task) {

            return res.status(404).json({
                message: "Task not found"
            });

        }


        res.status(200).json({

            message: "Task updated successfully",

            task

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


        const task = await Task.findByIdAndDelete(id);


        if (!task) {

            return res.status(404).json({
                message: "Task not found"
            });

        }


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