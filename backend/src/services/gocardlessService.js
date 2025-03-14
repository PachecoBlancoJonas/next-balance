import axios from "axios";
import moment from "moment";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;
const GOCARDLESS_EXPIRED_HOURS = "72h";


export const getAccessToken = async (token) => {    
    const { accessExpiresAt, refreshToken, refreshExpiresAt } = token;
    const accessExpiresDate = moment(accessExpiresAt);
    const refreshExpiresDate = moment(refreshExpiresAt);
    const now = moment();

    if (accessExpiresDate.isBefore(now)) {
        if (refreshExpiresDate.isBefore(now)) {
            token = await getNewAccessToken();
        } else {
            token = await getNewAccessToken(refreshToken);
        }
    }

    const newToken = jwt.sign(token, SECRET_KEY, {
        expiresIn: GOCARDLESS_EXPIRED_HOURS,
    });
    return newToken;
};

export const createAccessToken = async (secret_id, secret_key) => {
    
    const token = await getNewAccessToken(secret_id, secret_key);

    const newToken = jwt.sign(token, SECRET_KEY, {
        expiresIn: GOCARDLESS_EXPIRED_HOURS,
    });
    return newToken;
};

export const getNewAccessToken = async (
    secret_id = null,
    secret_key = null,
    refreshToken = false
) => {
    // Return a new AccessToken getting with RefreshToken
    if (refreshToken) {
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

            return newToken;
        } catch (err) {
            console.error("Error fetching token:", err);
            throw new Error("Error fetching token");
        }
    }

    // Return a new AccessToken
    else {
        try {
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
            console.error("Error fetching token:", err);
            throw new Error("Cannot get token");
        }
    }
};
