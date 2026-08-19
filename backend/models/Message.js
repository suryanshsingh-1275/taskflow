import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        text: {
            type: String,
            default: "",
            trim: true,
        },
        
        attachmentUrl: {
            type: String,
            default: null,
        },

        attachmentName: {
            type: String,
            default: null,
        },

        attachmentType: {
            type: String,
            enum: ["pdf", "doc", "image", "other", null],
            default: null,
        },
    },

    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;