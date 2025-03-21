import axios from "axios";
import moment from "moment";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;
const GOCARDLESS_EXPIRED_HOURS = "72h";
import * as userService from "../services/userService.js";

export const getAccessToken = async (token = null) => {
    if (!token) {
        token = await createAccessToken();
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
                token = await createAccessToken();
            } else {
                // If AccessToken expired try to Refresh
                token = await refreshAccessToken(token);
            }
        }
    }

    // Encode and return the token
    const newToken = jwt.sign(token, SECRET_KEY, {
        expiresIn: GOCARDLESS_EXPIRED_HOURS,
    });
    return newToken;
};

// Create newAccessToken
export const createAccessToken = async (
    secret_id = null,
    secret_key = null
) => {
    try {
        // If dont have secret get from DB
        if (!secret_id || !secret_key) {
            const secret = await userService.getGocardlessSecret(req.user.id);
            secret_id = secret.gocardless_id;
            secret_key = secret.gocardless_key;
        }
        const response = await axios.post(
            `${process.env.GOCARDLESS_API_BASE_URL}/token/new/`,
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
        console.error("Error creating token:", err);
        throw new Error("Cannot create token");
    }
};

const refreshAccessToken = async (token) => {
    const { refreshToken } = token;
    try {
        const response = await axios.post(
            `${process.env.GOCARDLESS_API_BASE_URL}/token/refresh/`,
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
