// backend/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "dotenv/config";
import apiRoutes from "./src/routes/api.js";
import userRoutes from "./src/routes/userRouter.js";

// get env variables
// dotenv.config();

// server config
const server = express();
server.use(cookieParser()); // Usa cookie-parser para que las cookies estén disponibles en `req.cookies`
server.use(
    cors({
        origin: process.env.FRONTEND_URL, // Asegúrate de usar el URL correcto de tu frontend
        credentials: true, // Permitir que las cookies se envíen
    })
);
server.use(express.json()); // support JSON on requests

// Routes
server.use("/api", apiRoutes);
server.use("/user", userRoutes);

// Start server

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
