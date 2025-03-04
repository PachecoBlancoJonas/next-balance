// backend/createUserTable.js
import pool from "./src/db/index.js";

async function createUserTable() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `);
        console.log("Tabla de usuarios creada");
    } catch (error) {
        console.error("Error creando la tabla de usuarios:", error);
    } finally {
        connection.release();
    }
}

createUserTable().catch(console.error);
