// backend/src/controllers/userController.js
import pool from "../db/index.js";

export const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    const connection = await pool.getConnection();
    try {
        const result = await connection.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, password]
        );
        res.status(201).json({ id: result.insertId, username, email });
    } catch (error) {
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
