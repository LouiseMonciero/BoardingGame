const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

// Connexion à la base de données
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// GET /api/categories => vue SQL View_Categories
router.get('/', (req, res) => {
    db.query('SELECT * FROM View_Categories', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;
