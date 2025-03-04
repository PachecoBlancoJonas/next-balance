// backend/src/controllers/userController.js
import pool from "../db/index.js";
import bcrypt from "bcrypt";
const saltRounds = 10; // Number of salt rounds

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
        const result = await connection.query(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );
        res.status(201).json({ id: Number(result.insertId), email });
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
