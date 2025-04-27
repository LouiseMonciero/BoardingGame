const express = require('express');
const router = express.Router();
const db = require('../config/db');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { verifyToken, checkBody } = require('../middlewares');

const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;

router.get('/check', (req, res) => {
    console.log(req.headers['authorization'].split(' ')[1]);
    if (req.headers['authorization']) {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.sendStatus(400);
        }

        const { status, message, payload } = verifyToken(token);
        if (status !== 200) {
            return res.status(status).json({ message });
        }

        db.query('SELECT * FROM Users WHERE id_user = ?', [payload.id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!results || results.length === 0) return res.sendStatus(404);
            return res.status(200).json({ data: results[0] });
        });

    } else {
        res.sendStatus(401);
    }
});

router.post('/signup', checkBody(['username', 'password']), async (req, res) => {
    const { username, password } = req.body;

    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push("• Password must be at least 8 characters long.");
    if (!/[A-Z]/.test(password)) passwordErrors.push("• Password must include at least one uppercase letter.");
    if (!/[a-z]/.test(password)) passwordErrors.push("• Password must include at least one lowercase letter.");
    if (!/\d/.test(password)) passwordErrors.push("• Password must include at least one number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) passwordErrors.push("• Password must include at least one special character.");

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        db.query('CALL Procedure_Create_User(?, ?, ?)', [
            username,
            hashedPassword,
            'user',
        ],
            (err) => {
                if (err) return res.status(500).json({ message: "DB error", error: err.message });
                return res.status(201).json({ message: "User registered successfully." });
            }
        );
    } catch (hashError) {
        return res.status(500).json({ message: "Error while hashing password", error: hashError.message });
    }
});

router.post('/login', checkBody(['username', 'password']), (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM Users WHERE username=?', [username], async (err, results) => {
        if (err) return res.status(500).json({ message: "DB error", error: err.message });

        if (results.length === 0) {
            return res.status(203).json({ message: "This username is not registered." });
        }

        const user = results[0];
        try {

            const isValid = await bcrypt.compare(password, user.password_user);

            if (!isValid) {
                return res.status(401).json({ message: "Invalid username or password." });
            }

            const token = jwt.sign(
                { username: user.username, id: user.id_user },
                secretKey,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                username: user.username,
                userId: user.id_user,
                level_permission: user.level_permission,
                sessionToken: token,
                message: "Successful login"
            });

        } catch (compareErr) {
            return res.status(500).json({ message: "Error while checking password", error: compareErr.message });
        }
    });
});


module.exports = router;
