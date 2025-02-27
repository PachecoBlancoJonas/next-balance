// backend/routes/api.js
import { Router } from "express";
import axios from "axios";
const router = Router();
import tokenController from "../controllers/tokenController.js";
const { getAccessToken } = tokenController;

// Route for banks list
router.get("/banks/", async (req, res) => {
    const { country } = req.query;

    console.log(`Request GET /banks/?country=${country}`);
    try {
        const { accessToken } = await getAccessToken();

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
        console.error(error);
        res.status(500).json({ message: "Error obteniendo los bancos" });
    }
});

// Route for get bank link
router.get("/bank-link/", async (req, res) => {
    console.log(`Request GET /bank-link/`);
    try {
        const { accessToken } = await getAccessToken();

        const response = await axios.post(
            `${process.env.GOCARDLESS_API_BASE_URL}/requisitions/`,
            {
                redirect: "http://localhost:5001",
                institution_id: process.env.SANTANDER_ID,
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo los bancos" });
    }
});

export default router;
