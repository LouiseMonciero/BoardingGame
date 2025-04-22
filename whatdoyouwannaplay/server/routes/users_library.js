const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { checkBody } = require('../middlewares');

// POST /api/library => ajoute un jeu à la bibliothèque d’un utilisateur (Procedure_Add_Game_To_UserLibrary)
router.post('/', checkBody(['id_user', 'id_game']), (req, res) => {
    const { id_user, id_game } = req.body;

    db.query('SELECT * FROM View_Games WHERE id_game = ?', [id_game], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Jeu non trouvé' });

        db.query('CALL Procedure_Add_Game_To_UserLibrary(?, ?)', [id_user, id_game], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Jeu ajouté à la bibliothèque de l’utilisateur' });
        });

    });


});

// GET /api/library/:id_user => récupère les jeux d’un utilisateur (Procedure_User_Library)
router.get('/:id_user', (req, res) => {
    const id_user = req.params.id_user;

    db.query('SELECT * FROM View_Users WHERE id_user = ?', [id_user], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });

        db.query('CALL Procedure_User_Library(?)', [id_user], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results[0]); // Résultat dans le premier tableau
        });

    });

});

module.exports = router;
