import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;

const verifyCardless = (req, res, next) => {
    const gocardlessToken = req.cookies.gocardlessToken;
    const user_id = req.user.user_id;

    // TODO:
    // 1º gocardlessAccessToken cookie exists?
    if (gocardlessToken) {
        // if access is expired -> refresh token
        // else if refresh also expired -> 2º
        // gocardlessservice.getGocardlessToken
    } else {
        // 2º If not -> user have SECRET?
        // get SECRET from DB with user_id
        // create new gocardlessAccessToken cookie
        try {
            
        }

    }


    // 3º If not -> error, secret needed

    jwt.verify(gocardlessToken, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        req.accessToken = decoded;
        next();
    });
};

export default verifyCardless;
