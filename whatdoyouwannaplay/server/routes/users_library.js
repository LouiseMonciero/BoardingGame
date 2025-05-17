const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { checkBody, isOwner } = require('../middlewares');

// POST /api/library => ajoute ou retire un jeu de la bibliothèque d’un utilisateur (toggle)
router.post('/:id', isOwner, checkBody(['id_game']), (req, res) => {
    const id_user = req.params.id;
    const { id_game } = req.body;

    db.query('SELECT * FROM View_Games WHERE id_game = ?', [id_game], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Jeu non trouvé' });

        // Vérifie si le jeu est déjà dans la bibliothèque de l'utilisateur
        db.query('SELECT * FROM Favorites WHERE id_game = ? AND id_user = ?', [id_game, id_user], (err2, favResults) => {
            if (err2) return res.status(500).json({ error: err2 });

            if (favResults.length > 0) {
                // Déjà en favoris, donc on retire
                db.query('DELETE FROM Favorites WHERE id_game = ? AND id_user = ?', [id_game, id_user], (err3) => {
                    if (err3) return res.status(500).json({ error: err3.message });
                    res.json({ message: 'Jeu retiré de la bibliothèque de l’utilisateur' });
                });
            } else {
                // Pas encore en favoris, donc on ajoute
                db.query('INSERT INTO Favorites (id_game, id_user) VALUES (?, ?)', [id_game, id_user], (err4) => {
                    if (err4) return res.status(500).json({ error: err4.message });
                    res.status(201).json({ message: 'Jeu ajouté à la bibliothèque de l’utilisateur' });
                });
            }
        });
    });
});

// GET /api/library/:id => récupère les jeux d’un utilisateur (Procedure_User_Library)
router.get('/:id', isOwner, (req, res) => {
    const id_user = req.params.id;

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