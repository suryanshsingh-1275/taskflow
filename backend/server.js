import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import connectDB from "./config/db.js";
import { pubClient, subClient } from "./config/redis.js";

import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

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


// SOCKET.IO SETUP

// app.listen() normally creates a raw http.Server internally and
// hides it from you. Socket.io needs direct access to that server


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});


// Wires Socket.io to Redis pub/sub.

io.adapter(createAdapter(pubClient, subClient));


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

    socket.join(socket.userId);

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.userId);
    });

});


app.set("io", io);


const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log("Server Running");
});