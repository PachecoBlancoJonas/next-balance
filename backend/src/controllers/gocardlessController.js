import * as gocardlessService from "../services/gocardlessService.js";
import * as userService from "../services/userService.js";
import cookie_config from "../utils/cookieConfig.js";

export const getAccessToken = async (req, res) => {
    const gocardlessToken = req.cookies.gocardlessToken || {};
    try {
        const newToken = await gocardlessService.getAccessToken(
            gocardlessToken
        );
        const updatedToken = {
            ...gocardlessToken,
            ...newToken,
        };
        res.cookie("gocardlessToken", updatedToken, cookie_config);
        res.json({
            message: "gocardlessToken updated successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createAccessToken = async (req, res) => {
    // Get gocardless secret from FORM
    const { gocardless_id, gocardless_key } = req.body;


    // Else get from DB
    if (!gocardless_id || !gocardless_key) {
        const secret = await userService.getGocardlessSecret(req.user.id);
        
        gocardless_id = secret.gocardless_id;
        gocardless_key = secret.gocardless_key;
    }

    // Else throw error
    if (!gocardless_id || !gocardless_key) {
        return res
            .status(400)
            .json({ error: "Missing GoCardless credentials" });
    }

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
