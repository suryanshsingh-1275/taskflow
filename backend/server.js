import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import connectDB from "./config/db.js";
import { pubClient, subClient } from "./config/redis.js";

import Board from "./models/Board.js";
import Message from "./models/Message.js";

import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);


// SOCKET.IO SETUP

// app.listen() normally creates a raw http.Server internally and
// hides it from you. Socket.io needs direct access to that server
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
    },
});


// Wires Socket.io to Redis pub/sub. With exactly one backend

io.adapter(createAdapter(pubClient, subClient));


// Middleware

io.use((socket, next) => {

    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error("Authentication required"));
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.userId = decoded.userId;

        next();

    } catch (error) {

        next(new Error("Invalid token"));

    }

});


io.on("connection", (socket) => {

    console.log("Socket connected:", socket.userId);

    // Each user gets a room named after their own user ID. Later,
    socket.join(socket.userId);

    // Notifications used a room per USER (socket.userId) — chat needs

    socket.on("join-board", (boardId) => {

        socket.join(`board:${boardId}`);

    });


    socket.on("send-message", async (data) => {

        try {

            const {
                boardId,
                text,
                attachmentUrl,
                attachmentName,
                attachmentType,
            } = data;

            // A message needs EITHER real text OR an attachment 
            const hasText = text && text.trim() !== "";

            if (!boardId || (!hasText && !attachmentUrl)) {
                return;
            }


            const board = await Board.findById(boardId);

            if (!board) {
                return;
            }

            const isOwner = board.owner.toString() === socket.userId;

            const isMember = board.members.some(
                (memberId) => memberId.toString() === socket.userId
            );

            if (!isOwner && !isMember) {
                return;
            }


            const message = await Message.create({
                board: boardId,
                sender: socket.userId,
                text: hasText ? text.trim() : "",
                attachmentUrl: attachmentUrl || null,
                attachmentName: attachmentName || null,
                attachmentType: attachmentType || null,
            });

            const populatedMessage = await Message.findById(message._id)
                .populate("sender", "name");


            io.to(`board:${boardId}`).emit("new-message", populatedMessage);

        } catch (error) {

            console.error("Send Message Error:", error);

        }

    });


    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.userId);
    });

});


app.set("io", io);


const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log("Server Running");
});