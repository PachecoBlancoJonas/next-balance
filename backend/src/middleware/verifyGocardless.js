import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;
import * as gocardlessService from "../services/gocardlessService.js";
import cookie_config from "../utils/cookieConfig.js";
const GOCARDLESS_EXPIRED_HOURS = "72h";

const verifyCardless = async (req, res, next) => {
    let encodedToken = req.cookies.gocardlessToken;
    let decodedToken;
    if (encodedToken) {
        jwt.verify(encodedToken, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res
                    .status(403)
                    .json({ error: "Gocardless Secret missed" });
            }
            decodedToken = decoded;
        });
    }
    // Update token
    try {
        decodedToken = await gocardlessService.getAccessToken(
            decodedToken,
            req.user.id
        );

        // const newData = { ...decodedToken, iat: undefined, exp: undefined };
        // console.log(newData);

        delete decodedToken.iat;
        delete decodedToken.exp;
        const newToken = jwt.sign(decodedToken, SECRET_KEY, {
            expiresIn: `${GOCARDLESS_EXPIRED_HOURS}`,
        });

        res.cookie("gocardlessToken", newToken, cookie_config);

        req.accessToken = decodedToken.accessToken;
        next();
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Error fetching banks" });
    }

    // const gocardlessToken = await gocardlessService.getAccessToken(
    //     req.cookies.gocardlessToken,
    //     req.user.id
    // );

    // res.cookie("gocardlessToken", gocardlessToken, cookie_config);

    // jwt.verify(gocardlessToken, SECRET_KEY, (err, decoded) => {
    //     if (err) {
    //         return res.status(403).json({ error: "Gocardless Secret missed" });
    //     }

    //     req.accessToken = decoded.accessToken;
    //     next();
    // });
};

export default verifyCardless;
