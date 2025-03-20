import * as userService from "../services/userService.js";
import cookie_config from "../utils/cookieConfig.js";

export const createUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = await userService.createUser(email, password);
        res.cookie("token", newUser.token, cookie_config);
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

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { token, user } = await userService.loginUser(email, password);
        res.cookie("token", token, cookie_config);
        res.json({ id: user.id, email });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const addGocardless = async (req, res) => {
    const { gocardless_id, gocardless_key } = req.body;
    const { id } = req.user;

    try {
        await userService.addGocardless(id, gocardless_id, gocardless_key);
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

    // get user 
    res.json({ id: req.user.id, email: req.user.email });
};

export const getGocardless = async (req, res) => {
    try {
        const gocardless_id = await userService.getGocardless(req.user.id);

        res.json(gocardless_id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
