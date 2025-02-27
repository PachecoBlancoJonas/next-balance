import axios from "axios";

const getNewAccessToken = async () => {
    try {
        const response = await axios.post(
            `${process.env.GOCARDLESS_API_BASE_URL}/token/new/`,
            {
                secret_id: process.env.SECRET_ID,
                secret_key: process.env.SECRET_KEY,
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
        const data = {
            accessToken: response.data.access,
            accessExpiresAt: accessExpireDate.toISOString(),
            refreshToken: response.data.refresh,
            refreshExpiresAt: refreshExpireDate.toISOString(),
            updatedAt: now.toISOString(),
        };

        return data;
    } catch (err) {
        console.error("Error obteniendo el token:", err);
        throw new Error("No se pudo obtener el token");
    }
};

const refreshAccessToken = async (refresh) => {
    try {
        const response = await axios.post(
            `${process.env.GOCARDLESS_API_BASE_URL}/token/refresh/`,
            {
                refresh,
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
        const data = {
            accessToken: response.data.access,
            accessExpiresAt: accessExpireDate.toISOString(),
            updatedAt: now.toISOString(),
        };

        return data;
    } catch (err) {
        console.error("Error obteniendo el token:", err);
        throw new Error("No se pudo obtener el token");
    }
};

export default { getNewAccessToken, refreshAccessToken };
