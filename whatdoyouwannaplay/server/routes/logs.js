const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAdmin } = require('../middlewares');

// GET /api/logs => vue SQL View_Logs_Users (récupère tous les logs avec noms d’utilisateurs)
/*router.get('/', isAdmin, (req, res) => {
    db.query('SELECT * FROM View_Logs_Users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});*/

router.get('/', isAdmin, (req, res) => {
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit <= 0) limit = 100;
    db.query('SELECT * FROM Logs ORDER BY date_log DESC LIMIT ?', [limit], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;
