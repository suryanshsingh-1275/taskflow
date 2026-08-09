import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
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

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        visibility: {
            type: String,
            enum: ["Private", "Team", "Public"],
            default: "Private",
        },

        favorite: {
            type: Boolean,
            default: false,
        },

        archived: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    }
);

const Board = mongoose.model("Board", boardSchema);

export default Board;