import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth",authRoutes);
app.use("/api/boards",boardRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/analytics",analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("Server Running ");
});
