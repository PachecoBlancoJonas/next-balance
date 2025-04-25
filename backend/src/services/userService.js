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

export const createUser = async (email, password) => {
    // Create a new connection to DB
    const connection = await pool.getConnection();
    try {
        // hash password
        const hashedPassword = await hashPassword(password);

        // Create new user in the DB
        const result = await pool.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        // Get userId of the new user
        const userId = result.insertId.toString();

        // If Ok -> Create token
        const token = jwt.sign({ id: userId, email }, SECRET_KEY, {
            expiresIn: "1h",
        });
        return { id: userId, email, token };
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

export const saveAccounts = async (account, iban, user_id) => {
    const connection = await pool.getConnection();
    try {
        await pool.execute(
            "INSERT INTO accounts (account_ref, iban, user_id) VALUES (?, ?, ?)",
            [account, iban, user_id]
        );
    } catch (error) {
        console.log(error);
    } finally {
        connection.release();
    }
};

export const saveTransactions = async (account_id, transactions) => {
    const connection = await pool.getConnection();
    try {
        for (const transaction of transactions) {
            await pool.execute(
                "INSERT INTO transactions (transaction_ref, value_date, amount, concept, account_id) VALUES (?, ?, ?, ?, ?)",
                [
                    transaction.internalTransactionId,
                    transaction.valueDate,
                    transaction.transactionAmount.amount,
                    transaction.remittanceInformationUnstructured,
                    account_id,
                ]
            );
        }
    } catch (error) {
        console.log(error);
    } finally {
        connection.release();
    }
};

export const loginUser = async (email, password) => {
    // Get user from DB
    const rows = await pool.execute("SELECT * FROM users WHERE email = ?", [
        email,
    ]);

    if (rows.length === 0) {
        throw new Error("User not found");
    }
    const user = rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Bad password");
    }

    // If Ok -> Create token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
    });
    return { token, user };
};

export const addGocardless = async (user_id, gocardless_id, gocardless_key) => {
    if (gocardless_id === null) {
        throw new Error("Secret ID needed");
    }
    if (gocardless_key === null) {
        throw new Error("Secret Key needed");
    }

    const connection = await pool.getConnection();
    try {
        await connection.execute(
            "UPDATE users SET gocardless_id = ?, gocardless_key = ? WHERE id = ?",
            [gocardless_id, gocardless_key, user_id]
        );
        return { message: "success" };
    } catch (error) {
        throw error;
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
        throw new Error("Error fetching users");
    } finally {
        connection.release();
    }
};

export const getAccounts = async (user_id) => {
    const connection = await pool.getConnection();
    try {
        const accounts = await connection.query(
            "SELECT * FROM accounts WHERE user_id = ?",
            [user_id]
        );
        return accounts;
    } catch (error) {
        throw new Error("Error fetching accounts");
    } finally {
        connection.release();
    }
};

export const getTransactions = async (account_id) => {
    const connection = await pool.getConnection();
    try {
        const transactions = await connection.query(
            "SELECT * FROM transactions WHERE account_id = ? ORDER BY value_date DESC",
            [account_id]
        );
        return transactions;
    } catch (error) {
        throw new Error("Error fetching transactions");
    } finally {
        connection.release();
    }
};

export const getGocardless = async (user_id) => {
    const connection = await pool.getConnection();
    try {
        const gocardless_id = await connection.query(
            "SELECT gocardless_id FROM users WHERE id = ? LIMIT 1",
            user_id
        );

        return gocardless_id[0];
    } catch (error) {
        throw new Error("Error fetching gocardless_id");
    } finally {
        connection.release();
    }
};

export const getGocardlessSecret = async (user_id) => {
    const connection = await pool.getConnection();

    try {
        const secret = await connection.query(
            "SELECT gocardless_id, gocardless_key FROM users WHERE id = ? LIMIT 1",
            user_id
        );

        return secret[0];
    } catch (error) {
        throw new Error("Error fetching gocardless secret");
    } finally {
        connection.release();
    }
};
