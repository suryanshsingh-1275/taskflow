import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "task-assigned",   
                "task-updated",   
                "due-date",       
                "board-invite",    
                "board-removed",  
            ],
            required: true,
        },

        
        message: {
            type: String,
            required: true,
            trim: true,
        },

       
        relatedBoard: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
        },

        relatedTask: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },

        read: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;