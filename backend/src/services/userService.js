import bcrypt from "bcrypt";
const saltRounds = 10;
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

const SECRET_KEY = process.env.JWT_SECRET;

// Function to hash the password
const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const loginUser = async (email, password) => {
    // Buscar al usuario por su email
    const rows = await pool.execute("SELECT * FROM users WHERE email = ?", [
        email,
    ]);

    if (rows.length === 0) {
        throw new Error("Usuario no encontrado");
    }

    const user = rows[0];

    // Comparar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Contraseña incorrecta");
    }

    // Crear un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
    });

    return token;
};

export const createUser = async (email, password) => {
    const connection = await pool.getConnection();
    try {
        const hashedPassword = await hashPassword(password);
        const result = await connection.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        const userId = result.insertId.toString();

        // Generar el token
        const token = jwt.sign({ id: userId, email }, SECRET_KEY, {
            expiresIn: "1h",
        });

        return { id: userId, email, token };
    } catch (error) {
        throw error; // Deja que el controlador maneje los errores
    } finally {
        connection.release();
    }
};

export const getUsers = async () => {
    const connection = await pool.getConnection();
    try {
        const users = await connection.query("SELECT * FROM users");
        return users;
    } catch (error) {
        throw new Error("Error obteniendo los usuarios");
    } finally {
        connection.release();
    }
};
