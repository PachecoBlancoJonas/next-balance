// backend/src/controllers/userController.js
import pool from "../db/index.js";
import * as userService from "../services/userService.js";

export const createUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = await userService.createUser(email, password);
        res.cookie("token", newUser.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Solo se enviará por HTTPS
            sameSite: "Strict", // Mejora la seguridad contra CSRF
            expires: new Date(Date.now() + 3600000), // Expira en 1 hora
        });
        res.status(201).json({
            message: "User created successfully",
            // token: newUser.token,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already exists" });
        }
        console.error("Database error:", error);
        res.status(500).json({ error: "Error creating user" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        const data = {
            users: users,
            activeUser: req.activeUser,
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await userService.loginUser(email, password);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Solo se enviará por HTTPS
            sameSite: "Strict", // Mejora la seguridad contra CSRF
            expires: new Date(Date.now() + 3600000), // Expira en 1 hora
        });
        // res.json({ token });
        res.json({ logged: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getCurrentUser = (req, res) => {
    if (!req.activeUser)
        return res.status(401).json({ error: "No autenticado" });

    res.json({ id: req.activeUser.id, email: req.activeUser.email });
};
