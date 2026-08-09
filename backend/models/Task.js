import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true,
        },

        column: {
            type: String,
            enum: ["todo", "progress", "review", "done"],
            default: "todo",
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        dueDate: {
            type: Date,
        },

        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        completed: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;