// backend/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const apiRoutes = require("./src/routes/api");

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
