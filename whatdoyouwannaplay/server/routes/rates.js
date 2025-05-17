const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { checkBody, isAdmin } = require('../middlewares');

// GET api/rates/:id_user => récupérer toutes les évaluations d'un utilisateur
router.get('/:id_user', (req, res) => {
    const id_user = req.params.id_user;

    db.query('SELECT * FROM View_Raters WHERE id_user = ?', [id_user], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Aucune évaluation trouvée pour cet utilisateur' });
        res.json(results);
    });
});

// POST /api/rates/:id_game => transaction SQL Transactions_Rate_Game (id de game)
router.post('/:id_game', checkBody(['id_user', 'rating']), (req, res) => {
    const id_game = req.params.id_game;
    const { id_user, rating } = req.body;

    // Étape 1 : Vérifier que le jeu existe
    db.query('SELECT * FROM View_Games WHERE id_game = ?', [id_game], (err, gameResults) => {
        if (err) return res.status(500).json({ error: err });
        if (gameResults.length === 0) return res.status(404).json({ error: 'Jeu introuvable' });

        // Étape 2 : Récupérer id_rate depuis la vue View_Rates_id
        db.query('SELECT id_rate FROM View_Rates_id WHERE id_game = ?', [id_game], (err, rateResults) => {
            if (err) return res.status(500).json({ error: err });
            if (rateResults.length === 0) return res.status(404).json({ error: 'Évaluation non trouvée pour ce jeu' });

            const id_rate = rateResults[0].id_rate;

            // Étape 3 : Appeler la procédure stockée avec les bons paramètres
            db.query('CALL Transactions_Rate_Game(?, ?, ?, ?)', [id_game, id_rate, id_user, rating], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ message: 'Évaluation enregistrée' });
            });
        });
    });
});


// DELETE /api/rates/:id_game => procédure stockée Procedure_Delete_Rate
router.delete('/:id_game', isAdmin, (req, res) => {
    const id_rate = req.params.id;

    db.query('CALL Procedure_Delete_Rate(?)', [id_rate], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Évaluation supprimée' });
    });
});

module.exports = router;
