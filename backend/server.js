import "dotenv/config";

import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
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


// ==========================================
// PATH SETUP
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ==========================================
// EXPRESS SETUP
// ==========================================

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
    })
);

app.use(express.json());


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);


// ==========================================
// FRONTEND
// ==========================================

// During the Render build, Vite creates:
// frontend/dist/
//
// Express will serve that production React app.

const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));


// React Router fallback
//
// If the browser requests something like:
//
// /
// /boards
// /profile
// /analytics
//
// Express sends React's index.html.

app.use((req, res, next) => {
    if (
        req.path.startsWith("/api") ||
        req.path.startsWith("/socket.io")
    ) {
        return next();
    }

    res.sendFile(path.join(frontendPath, "index.html"));
});


// ==========================================
// HTTP SERVER
// ==========================================

const server = http.createServer(app);


// ==========================================
// SOCKET.IO
// ==========================================

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
    },
});


// ==========================================
// REDIS ADAPTER
// ==========================================

io.adapter(createAdapter(pubClient, subClient));


// ==========================================
// SOCKET AUTHENTICATION
// ==========================================

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


// ==========================================
// SOCKET CONNECTION
// ==========================================

io.on("connection", (socket) => {

    console.log("Socket connected:", socket.userId);


    // ==========================================
    // USER ROOM
    // ==========================================

    socket.join(socket.userId);


    // ==========================================
    // JOIN BOARD CHAT
    // ==========================================

    socket.on("join-board", (boardId) => {

        socket.join(`board:${boardId}`);

    });


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    socket.on("send-message", async (data) => {

        try {

            const {
                boardId,
                text,
                attachmentUrl,
                attachmentName,
                attachmentType,
            } = data;


            const hasText =
                text &&
                text.trim() !== "";


            // Message must contain text OR attachment

            if (
                !boardId ||
                (!hasText && !attachmentUrl)
            ) {
                return;
            }


            // Find board

            const board =
                await Board.findById(boardId);


            if (!board) {
                return;
            }


            // ==========================================
            // CHECK BOARD ACCESS
            // ==========================================

            const isOwner =
                board.owner.toString() === socket.userId;


            const isMember =
                board.members.some(
                    (memberId) =>
                        memberId.toString() === socket.userId
                );


            if (!isOwner && !isMember) {
                return;
            }


            // ==========================================
            // CREATE MESSAGE
            // ==========================================

            const message =
                await Message.create({

                    board: boardId,

                    sender: socket.userId,

                    text: hasText
                        ? text.trim()
                        : "",

                    attachmentUrl:
                        attachmentUrl || null,

                    attachmentName:
                        attachmentName || null,

                    attachmentType:
                        attachmentType || null,

                });


            // ==========================================
            // POPULATE SENDER
            // ==========================================

            const populatedMessage =
                await Message.findById(message._id)
                    .populate("sender", "name");


            // ==========================================
            // SEND TO BOARD ROOM
            // ==========================================

            io
                .to(`board:${boardId}`)
                .emit(
                    "new-message",
                    populatedMessage
                );

        } catch (error) {

            console.error(
                "Send Message Error:",
                error
            );

        }

    });


    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on("disconnect", () => {

        console.log(
            "Socket disconnected:",
            socket.userId
        );

    });

});


// ==========================================
// MAKE SOCKET.IO AVAILABLE TO CONTROLLERS
// ==========================================

app.set("io", io);


// ==========================================
// START SERVER
// ==========================================

const PORT =
    process.env.PORT || 5001;


server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server Running on port ${PORT}`
        );

    }
);
