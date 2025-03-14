const cookie_config = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(Date.now() + 3600000),
};

export default cookie_config;
