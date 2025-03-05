import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

const SECRET_KEY = process.env.JWT_SECRET;

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
