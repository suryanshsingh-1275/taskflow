import { Readable } from "stream";
import Message from "../models/Message.js";
import Board from "../models/Board.js";
import cloudinary from "../config/cloudinary.js";


const isOwnerOrMember = (board, userId) => {

    const isOwner = board.owner.toString() === userId.toString();

    const isMember = board.members.some(
        (memberId) => memberId.toString() === userId.toString()
    );

    return isOwner || isMember;

};


export const getBoardMessages = async (req, res) => {

    try {

        const { boardId } = req.params;

        const board = await Board.findById(boardId);

        if (!board) {

            return res.status(404).json({
                message: "Board not found"
            });

        }

        if (!isOwnerOrMember(board, req.user.userId)) {

            return res.status(403).json({
                message: "You do not have access to this board"
            });

        }


        const messages = await Message.find({
            board: boardId
        })
            .populate("sender", "name")
            .sort({ createdAt: 1 })
            .limit(100);


        res.status(200).json({

            messages

        });

    } catch (error) {

        console.error("Get Board Messages Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};




const streamUpload = (buffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {
                resource_type: "auto", 
                folder: "taskflow-chat",
            },

            (error, result) => {

                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }

            }

        );

        Readable.from(buffer).pipe(stream);

    });

};



export const uploadAttachment = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "No file provided"
            });

        }


        const result = await streamUpload(req.file.buffer);


        let attachmentType = "other";

        if (req.file.mimetype === "application/pdf") {
            attachmentType = "pdf";
        } else if (req.file.mimetype.startsWith("image/")) {
            attachmentType = "image";
        } else if (req.file.mimetype.includes("word")) {
            attachmentType = "doc";
        }


        res.status(200).json({

            attachmentUrl: result.secure_url,

            attachmentName: req.file.originalname,

            attachmentType,

        });

    } catch (error) {

        console.error("Upload Attachment Error:", error);

        res.status(500).json({
            message: "Upload failed"
        });

    }

};