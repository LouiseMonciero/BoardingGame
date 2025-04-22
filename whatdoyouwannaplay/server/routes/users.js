const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { checkBody } = require('../middlewares');

// GET /api/users => vue SQL View_Users
router.get('/', (req, res) => {
    db.query('SELECT * FROM View_Users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// GET /api/users/admins => vue SQL View_Users_Admins
router.get('/admins', (req, res) => {
    db.query('SELECT * FROM View_Users_Admins', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// DELETE /api/users/:id => procédure stockée Procedure_Delete_User
router.delete('/:id', (req, res) => {
    const id_user = req.params.id;

    db.query('SELECT * FROM View_Users WHERE id_user = ?', [id_user], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });

        db.query('CALL Procedure_Delete_User(?)', [id_user], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const message = 'Utilisateur supprimé';
            res.json({ results: results, message: message });
        });
    });

});

// PUT /api/users/:id/permission => procédure stockée Procedure_Change_User_Permission
router.put('/:id/permission', checkBody(['new_permission']), (req, res) => {
    const id_user = req.params.id;
    const { new_permission } = req.body;

    db.query('SELECT * FROM View_Users WHERE id_user = ?', [id_user], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });

        db.query('CALL Procedure_Change_User_Permission(?, ?)', [id_user, new_permission], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Permission modifiée' });
        });
    });
});

// GET /api/users/:id/permission => fonction SQL Ft_Check_Permission
router.get('/:id/permission', (req, res) => {
    const id_user = req.params.id;

    db.query('SELECT * FROM View_Users WHERE id_user = ?', [id_user], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });

        db.query('SELECT Ft_Check_Permission(?) AS permission', [id_user], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ permission: results[0].permission });
        });
    });

});

module.exports = router;
