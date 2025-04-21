const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/logs => vue SQL View_Logs_Users (récupère tous les logs avec noms d’utilisateurs)
router.get('/', (req, res) => {
    db.query('SELECT * FROM View_Logs_Users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;
