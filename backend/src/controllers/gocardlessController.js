import * as gocardlessService from "../services/gocardlessService.js";
import * as userService from "../services/userService.js";
import cookie_config from "../utils/cookieConfig.js";
import jwt from "jsonwebtoken";
import axios from "axios";

const SECRET_KEY = process.env.JWT_SECRET;
const GOCARDLESS_EXPIRED_HOURS = "72h";

// Create new accessToken from FORM
export const createNewAccessToken = async (req, res) => {
    // Get gocardless secret from FORM
    const { gocardless_id, gocardless_key } = req.body;
    const { id } = req.user;

    // Create cookie gocardlessToken with credentials
    try {
        const tokenData = await gocardlessService.createAccessToken(
            id,
            gocardless_id,
            gocardless_key
        );
        const newToken = jwt.sign(tokenData, SECRET_KEY, {
            expiresIn: GOCARDLESS_EXPIRED_HOURS,
        });
        res.cookie("gocardlessToken", newToken, cookie_config);
        res.json({
            message: "gocardlessToken created successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCountries = async (req, res) => {
    try {
        const countries = await gocardlessService.getCountries();

        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBanks = async (req, res) => {
    const { country } = req.query;
    const accessToken = req.accessToken;

    try {
        const banks = await gocardlessService.getBanks(country, accessToken);

        res.json(banks);
    } catch (error) {
        console.error(error.message);
        res.status(502).json({
            message: "Failed to fetch banks from GoCardless API",
        });
    }
};

export const getTransactions = async (req, res) => {
    const { id } = req.user;
    const accessToken = req.accessToken;

    try {
        // first get the account_ref
        const accounts = await userService.getAccounts(id);
        for (const account of accounts) {
            const transactions = await gocardlessService.getTransactions(
                account.account_ref,
                accessToken
            );
            // Save transactions in DB
            await userService.saveTransactions(account.id, transactions);
        }

        res.json({ message: "Transactions downloaded successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(502).json({
            message: "Failed to fetch transactions from GoCardless API",
        });
    }
};

// Create new requisition from FORM
export const handleRequisition = async (req, res) => {
    // Get gocardless secret from FORM
    const { institution_id } = req.body;
    const accessToken = req.accessToken;

    try {
        // First create a requisition from the institution
        const { requisition_id, bank_link } =
            await gocardlessService.createRequisition(
                institution_id,
                accessToken
            );

        // Devolver al frontend la URL
        res.json({ bank_link });

        // res.json({
        //     message: "Requisition created successfully",
        // });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const fetchAndSaveAccounts = async (req, res) => {
    try {
        const { requisitionId } = req.body;
        const { id } = req.user;
        const accessToken = req.accessToken;

        const accounts = await gocardlessService.fetchAccounts(
            requisitionId,
            accessToken
        );
        // TODO save accounts in DB with other service
        for (const account of accounts) {
            const iban = await gocardlessService.fetchIban(
                account,
                accessToken
            );
            await userService.saveAccounts(account, iban, id);
        }

        res.status(200).json({
            message: "Accounts fetched and saved successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
};
