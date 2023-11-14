
const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};
const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
    cookie: {
        name: "refreshToken",
        options: {
            sameSite: "none" as const,
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        },
    },
};
const RESET_PASSWORD_TOKEN = {
    expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};

export {ACCESS_TOKEN, REFRESH_TOKEN, RESET_PASSWORD_TOKEN}