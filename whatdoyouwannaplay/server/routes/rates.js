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

// POST /api/games/:id/rate => transaction SQL Transactions_Rate_Game
router.post('/games/:id/rate', (req, res) => {
    const id_game = req.params.id;
    const { id_user, rating } = req.body;

    db.query('CALL Transactions_Rate_Game(?, ?, ?)', [id_game, id_user, rating], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Évaluation enregistrée' });
    });
});

// DELETE /api/rates/:id => procédure stockée Procedure_Delete_Rate
router.delete('/rates/:id', (req, res) => {
    const id_rate = req.params.id;

    db.query('CALL Procedure_Delete_Rate(?)', [id_rate], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Évaluation supprimée' });
    });
});

module.exports = router;
