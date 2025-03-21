import { Router } from "express";
import axios from "axios";
const router = Router();
import * as gocardlessController from "../controllers/gocardlessController.js";
const PORT = process.env.PORT;
import verifyUser from "../middleware/verifyUser.js";
import verifyGocardless from "../middleware/verifyGocardless.js";

// create a new AccessToken with SECRET from FORM or DB
router.post(
    "/create-new-access-token",
    verifyUser,
    gocardlessController.createNewAccessToken
);

// Route for banks list
router.get("/banks/", verifyGocardless, gocardlessController.getBanks);

// Route for get bank link
router.get("/bank-link/", async (req, res) => {
    console.log(`Request GET /bank-link/`);
    try {
        const { accessToken } = await getAccessToken();

        const response = await axios.post(
            `${process.env.GOCARDLESS_API_BASE_URL}/requisitions/`,
            {
                redirect: `http://localhost:${PORT}`,
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
        res.status(500).json({ message: "Error fetching banks" });
    }
});

export default router;
