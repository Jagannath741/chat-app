import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.routes.js';
import  connectDB  from './lib/db.js';
import { server, app } from './lib/socket.js';

// Load environment variables
dotenv.config();


// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === "production" ? "https://chat-app-5-tisa.onrender.com" : "http://localhost:5173",
    credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Support ES module directory resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
    });
}

// Start server and connect DB
const PORT = process.env.PORT || 6060;

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
    connectDB();
});
