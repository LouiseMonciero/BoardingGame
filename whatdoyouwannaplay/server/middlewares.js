const jwt = require("jsonwebtoken");
require('dotenv').config();
const db = require('./config/db');

const secretKey = process.env.SECRET_KEY;

function verifyToken(token) {
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

function isAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    if (!token) return res.sendStatus(400);

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid Token' });

        const userId = decoded.id;
        db.query('SELECT level_permission FROM users WHERE id_user = ?', [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.sendStatus(404);

            const permission = results[0].level_permission;
            if (permission !== 'admin') {
                return res.status(403).json({ message: 'Accès refusé : admin uniquement' });
            }

            next();

        });
    });
}

function isOwner(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    if (!token) return res.sendStatus(400);

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid Token' });

        const userId = decoded.id;
        const requestedId = parseInt(req.params.id); // supposé que l'ID est dans l'URL

        if (userId !== requestedId) {
            return res.status(403).json({ message: 'Accès refusé : vous devez être le propriétaire' });
        }

        next();
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

module.exports = { verifyToken, checkBody, isAdmin, isOwner };