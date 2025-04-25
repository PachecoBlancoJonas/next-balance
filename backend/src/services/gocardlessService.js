import axios from "axios";
import moment from "moment";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const GOCARDLESS_API_BASE_URL = process.env.GOCARDLESS_API_BASE_URL;

const GOCARDLESS_EXPIRED_HOURS = "72h";
import * as userService from "../services/userService.js";
import pool from "../db/index.js";

export const getCountries = async () => {
    const connection = await pool.getConnection();
    try {
        const countries = await connection.query(
            "SELECT * FROM countries ORDER BY name;"
        );
        return countries;
    } catch (error) {
        throw new Error("Error fetching countries");
    } finally {
        connection.release();
    }
};

export const getBanks = async (country, accessToken) => {
    try {
        const response = await axios.get(
            `${GOCARDLESS_API_BASE_URL}/institutions/?country=${country}`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error("Error fetching banks from GoCardless" + error.message);
    }
};

export const createRequisition = async (institution_id, accessToken) => {
    try {
        const payload = {
            institution_id,
            redirect: `${FRONTEND_URL}/gocardless/callback`,
        };
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        };
        const { data } = await axios.post(
            `${GOCARDLESS_API_BASE_URL}/requisitions/`,
            payload,
            { headers }
        );
        // console.log(data);
        return {
            requisition_id: data.id,
            bank_link: data.link,
        };
    } catch (error) {
        console.log(error);
        throw new Error(
            "Error creating requisition from GoCardless" + error.message
        );
    }
};

export const fetchAccounts = async (requisitionId, accessToken) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
            `${GOCARDLESS_API_BASE_URL}/requisitions/${requisitionId}`,
            { headers }
        );
        // return accounts as a list
        const { accounts } = response.data;
        return accounts;
    } catch (error) {
        console.log(error);
        throw new Error(
            "Error fetching accounts from GoCardless" + error.message
        );
    }
};

export const fetchIban = async (account_ref, accessToken) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
            `${GOCARDLESS_API_BASE_URL}/accounts/${account_ref}`,
            { headers }
        );
        // return accounts as a list
        const { iban } = response.data;
        return iban;
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching iban from GoCardless" + error.message);
    }
};

export const fetchBalance = async (account_ref, accessToken) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
            `${GOCARDLESS_API_BASE_URL}/accounts/${account_ref}/balances`,
            { headers }
        );
        // return accounts as a list
        const { iban } = response.data;
        return iban;
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching iban from GoCardless" + error.message);
    }
};

export const getTransactions = async (account_ref, accessToken) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
            `${GOCARDLESS_API_BASE_URL}/accounts/${account_ref}/transactions`,
            { headers }
        );
        // return transactions as a list
        const { transactions } = response.data;
        return transactions.booked;
    } catch (error) {
        console.log(error);
        throw new Error(
            "Error fetching accounts from GoCardless" + error.message
        );
    }
};

export const getAccessToken = async (token = null, user_id) => {
    // if (Object.keys(token).length === 0) {
    if (!token) {
        token = await createAccessToken(user_id);
    } else {
        // Calculate expired dates
        const { accessExpiresAt, refreshExpiresAt } = token;
        const accessExpiresDate = moment(accessExpiresAt);
        const refreshExpiresDate = moment(refreshExpiresAt);
        const now = moment();

        // If access is expired get a new one with refresh or secret
        if (accessExpiresDate.isBefore(now)) {
            // If RefreshToken also expired -> use Secret from DB
            if (refreshExpiresDate.isBefore(now)) {
                token = await createAccessToken(user_id);
            } else {
                // If AccessToken expired try to Refresh
                token = await refreshAccessToken(token);
            }
        }
    }

    // Encode and return the token
    // const newToken = jwt.sign(token, SECRET_KEY, {
    //     expiresIn: GOCARDLESS_EXPIRED_HOURS,
    // });

    // return newToken;
    return token;
};

// Create newAccessToken
export const createAccessToken = async (
    user_id,
    secret_id = null,
    secret_key = null
) => {
    try {
        // If dont have secret get from DB
        if (!secret_id || !secret_key) {
            const secret = await userService.getGocardlessSecret(user_id);
            secret_id = secret.gocardless_id;
            secret_key = secret.gocardless_key;
        }
        const response = await axios.post(
            `${GOCARDLESS_API_BASE_URL}/token/new/`,
            {
                secret_id: secret_id,
                secret_key: secret_key,
            },
            {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        );

        // Calculate expireDates
        const now = new Date();
        const accessExpireDate = new Date(
            now.getTime() + response.data.access_expires * 1000
        );
        const refreshExpireDate = new Date(
            now.getTime() + response.data.refresh_expires * 1000
        );
        const newToken = {
            accessToken: response.data.access,
            accessExpiresAt: accessExpireDate.toISOString(),
            refreshToken: response.data.refresh,
            refreshExpiresAt: refreshExpireDate.toISOString(),
            updatedAt: now.toISOString(),
        };

        return newToken;
    } catch (err) {
        // console.error("Error creating token:", err);
        throw new Error("Cannot create token");
    }
};

const refreshAccessToken = async (token) => {
    const { refreshToken } = token;
    try {
        const response = await axios.post(
            `${GOCARDLESS_API_BASE_URL}/token/refresh/`,
            {
                refreshToken,
            },
            {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        );

        // Calculate expireDates
        const now = new Date();
        const accessExpireDate = new Date(
            now.getTime() + response.data.access_expires * 1000
        );
        const newToken = {
            accessToken: response.data.access,
            accessExpiresAt: accessExpireDate.toISOString(),
            updatedAt: now.toISOString(),
        };
        const updatedToken = {
            ...token,
            ...newToken,
        };

        return updatedToken;
    } catch (err) {
        console.error("Error refreshing token:", err);
        throw new Error("Error refreshing token");
    }
};
