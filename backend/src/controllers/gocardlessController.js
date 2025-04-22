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
        const banks = await gocardlessService.getBanks(country, accessToken);

        res.json(banks);
    } catch (error) {
        console.error(error.message);
        res.status(502).json({
            message: "Failed to fetch banks from GoCardless API",
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
