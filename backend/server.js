// backend/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./src/routes/api.js";

// get env variables
dotenv.config();

// server config
const server = express();
server.use(cors());
server.use(express.json()); // support JSON on requests

// Routes
server.use("/api", apiRoutes);

// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
