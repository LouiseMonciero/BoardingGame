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
router.post('/users', (req, res) => {
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
router.delete('/users/:id', (req, res) => {
    const id_user = req.params.id;
    db.query('CALL Procedure_Delete_User(?)', [id_user], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Utilisateur supprimé' });
    });
});

// PUT /api/users/:id/permission => procédure stockée Procedure_Change_User_Permission
router.put('/users/:id/permission', (req, res) => {
    const id_user = req.params.id;
    const { new_permission } = req.body;
    db.query('CALL Procedure_Change_User_Permission(?, ?)', [id_user, new_permission], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Permission modifiée' });
    });
});

// GET /api/users/:id/permission => fonction SQL Ft_Check_Permission
router.get('/users/:id/permission', (req, res) => {
    const id_user = req.params.id;
    db.query('SELECT Ft_Check_Permission(?) AS permission', [id_user], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ permission: results[0].permission });
    });
});

module.exports = router;
