const express = require('express');
const router = express.Router();
const db = require('../config/db');

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
