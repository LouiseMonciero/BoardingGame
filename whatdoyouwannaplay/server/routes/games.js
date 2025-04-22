const express = require('express');
const router = express.Router();
const db = require('../config/db');

const { verifyToken, checkBody } = require('../middlewares');


// GET /api/games => View_Games
router.get('/', (req, res) => {
    db.query('SELECT * FROM View_Games', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// GET /api/games/search => Procedure_Search_Games
router.get('/search', (req, res) => {
    const { category, min_rating, rank_max } = req.query;
    db.query('CALL Procedure_Search_Games(?, ?, ?)', [category, min_rating, rank_max], (err, results) => {
        if (err) return res.status(500).json({ error: err, message: "erreur procedure search games" });
        res.json(results);
    });
});

// GET /api/games/:id => View_GameDetails
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM View_GameDetails WHERE id_game = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Jeu non trouvé' });
        res.json(results[0]);
    });
});

// POST /api/games => Procedure_Create_Game (à adapter selon les paramètres que tu choisis)
router.post('/', checkBody(['name_game', 'year_game', 'url', 'thumbnail', 'description',
    'boardgamemechanic', 'boardgamefamily', 'boardgameexpansion',
    'boardgameimplementation', 'boardgamepublisher', 'boardgameartist',
    'boardgamedesigner', 'id_rules']), (req, res) => {
        const {
            name_game, year_game, url, thumbnail, description,
            boardgamemechanic, boardgamefamily, boardgameexpansion,
            boardgameimplementation, boardgamepublisher, boardgameartist,
            boardgamedesigner, id_rules
        } = req.body;

        const sql = 'CALL Procedure_Create_Game(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            name_game, year_game, url, thumbnail, description,
            boardgamemechanic, boardgamefamily, boardgameexpansion,
            boardgameimplementation, boardgamepublisher, boardgameartist,
            boardgamedesigner, id_rules
        ];

        db.query(sql, values, (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Jeu créé avec succès' });
        });
    });

// PUT /api/games/:id => Procedure_Update_Game
router.put('/:id', checkBody(['name_game', 'year_game', 'url', 'thumbnail', 'description',
    'boardgamemechanic', 'boardgamefamily', 'boardgameexpansion',
    'boardgameimplementation', 'boardgamepublisher', 'boardgameartist',
    'boardgamedesigner', 'id_rules']), (req, res) => {
        const id_game = req.params.id;
        const {
            name_game, year_game, url, thumbnail, description,
            boardgamemechanic, boardgamefamily, boardgameexpansion,
            boardgameimplementation, boardgamepublisher, boardgameartist,
            boardgamedesigner, id_rules
        } = req.body;

        const sql = 'CALL Procedure_Update_Game(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            id_game, name_game, year_game, url, thumbnail, description,
            boardgamemechanic, boardgamefamily, boardgameexpansion,
            boardgameimplementation, boardgamepublisher, boardgameartist,
            boardgamedesigner, id_rules
        ];

        db.query(sql, values, (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Jeu mis à jour avec succès' });
        });
    });

// DELETE /api/games/:id => Procedure_Delete_Game
router.delete('/:id', (req, res) => {
    const id_game = req.params.id;

    db.query('SELECT * FROM View_Games WHERE id_game = ?', [id_game], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Jeu introuvable' });

        db.query('CALL Procedure_Delete_Game(?)', [id_game], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Jeu supprimé avec succès' });
        });

    });

});

module.exports = router;
