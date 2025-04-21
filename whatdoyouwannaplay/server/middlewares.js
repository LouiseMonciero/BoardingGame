const jwt = require("jsonwebtoken");

function verifyToken(token, secretKey) {
    if (!token) {
        return ({ status: 400, message: "Invalid format" });
    }

    return jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return ({ status: 401, message: "Invalid Token" });
        }
        return ({ status: 200, message: "Valid Token", payload: decoded });
    });
}

function checkBody(keys = []) {
    return (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({ error: 'Requête vide' });
        }

        for (const key of keys) {
            if (!req.body[key]) {
                return res.status(400).json({ error: `${key} requis` });
            }
        }
        next();
    }
}

module.exports = { verifyToken, checkBody };