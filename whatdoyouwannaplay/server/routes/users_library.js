const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// POST /api/library => ajoute un jeu à la bibliothèque d’un utilisateur (Procedure_Add_Game_To_UserLibrary)
router.post('/library', (req, res) => {
    const { id_user, id_game } = req.body;

    db.query('CALL Procedure_Add_Game_To_UserLibrary(?, ?)', [id_user, id_game], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Jeu ajouté à la bibliothèque de l’utilisateur' });
    });
});

// GET /api/library/:id_user => récupère les jeux d’un utilisateur (Procedure_User_Library)
router.get('/library/:id_user', (req, res) => {
    const id_user = req.params.id_user;

    db.query('CALL Procedure_User_Library(?)', [id_user], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results[0]); // Résultat dans le premier tableau
    });
});

module.exports = router;
