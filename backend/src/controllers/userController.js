import * as userService from "../services/userService.js";

const cookie_token_config = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(Date.now() + 3600000),
};

export const createUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = await userService.createUser(email, password);
        res.cookie("token", newUser.token, cookie_token_config);
        res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already exists" });
        }
        console.error("Database error:", error);
        res.status(500).json({ error: "Error creating user" });
    }
};

export const addGocardless = async (req, res) => {
    const { gocardlessID, gocardless_key } = req.body;
    const { id } = req.user;

    try {
        await userService.addGocardless(id, gocardlessID, gocardless_key);
        res.status(201).json({
            message: "GoCardless secret updated",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        const data = {
            users: users,
            user: req.user,
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { token, user } = await userService.loginUser(email, password);
        res.cookie("token", token, cookie_token_config);
        res.json({ id: user.id, email: user.email });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");

        res.json({ message: "Logout" });
    } catch (error) {
        res.status(500).json({ error: "Logout error" });
    }
};

export const getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    res.json({ id: req.user.id, email: req.user.email });
};

export const getGocardless = async (req, res) => {
    try {
        const gocardlessID = await userService.getGocardless(req.user.id);

        res.json(gocardlessID);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
