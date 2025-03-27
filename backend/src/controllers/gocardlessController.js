import * as gocardlessService from "../services/gocardlessService.js";
import * as userService from "../services/userService.js";
import cookie_config from "../utils/cookieConfig.js";
import axios from "axios";

// Create new accessToken from FORM
export const createNewAccessToken = async (req, res) => {
    // Get gocardless secret from FORM
    const { gocardless_id, gocardless_key } = req.body;

    // Create cookie gocardlessToken with credentials
    try {
        const newToken = await gocardlessService.createAccessToken(
            gocardless_id,
            gocardless_key
        );
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
        const response = await axios.get(
            `${process.env.GOCARDLESS_API_BASE_URL}/institutions/?country=${country}`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Error fetching banks" });
    }
};
