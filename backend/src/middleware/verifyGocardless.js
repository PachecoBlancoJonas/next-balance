import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;
import * as gocardlessService from "../services/gocardlessService.js";
import cookie_config from "../utils/cookieConfig.js";

const verifyCardless = (req, res, next) => {
    const gocardlessToken = gocardlessService.getAccessToken(
        req.cookies.gocardlessToken
    );
    res.cookie("gocardlessToken", gocardlessToken, cookie_config);

    jwt.verify(gocardlessToken, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Gocardless Secret missed" });
        }

        req.accessToken = decoded.accessToken;
        next();
    });
};

export default verifyCardless;
