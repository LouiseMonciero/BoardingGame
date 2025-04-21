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

// POST /api/users => procédure stockée Procedure_Create_User
router.post('/', (req, res) => {
    const { id_user, username, password_user, level_permission } = req.body;
    db.query('CALL Procedure_Create_User(?, ?, ?, ?)', [
        id_user,
        username,
        password_user,
        level_permission,
    ], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Utilisateur créé' });
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
router.put('/:id/permission', (req, res) => {
    const id_user = req.params.id;

    if (req.body !== undefined) {
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
    } else {
        res.json({ message: 'Veuillez remplir le body de la requete' });
    }
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
