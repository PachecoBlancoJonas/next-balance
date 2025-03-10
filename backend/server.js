// backend/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import apiRoutes from "./src/routes/api.js";
import userRoutes from "./src/routes/userRouter.js";

// server config
const server = express();
server.use(cookieParser());
server.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
server.use(express.json());

// Routes
server.use("/api", apiRoutes);
server.use("/user", userRoutes);

// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
