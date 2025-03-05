// backend/src/controllers/userController.js
import pool from "../db/index.js";
import bcrypt from "bcrypt";
import { loginUser } from "../services/authService.js";
const saltRounds = 10; // Number of salt rounds
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;

// Function to hash the password
const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const createUser = async (req, res) => {
    const { email, password } = req.body;
    const connection = await pool.getConnection();
    try {
        const hashedPassword = await hashPassword(password);
        const newUser = await connection.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );
        // Create token
        const token = jwt.sign(
            { id: newUser.insertId.toString(), email: email },
            SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );
        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already exists" });
        }
        console.error("Database error:", error);
        res.status(500).json({ error: "Error creando el usuario" });
    } finally {
        connection.release();
    }
};

export const getUsers = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const users = await connection.query("SELECT * FROM users");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo los usuarios" });
    } finally {
        connection.release();
    }
};

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await loginUser(email, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
