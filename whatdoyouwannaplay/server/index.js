const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'TON_MDP',
    database: 'BoardingGames'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connecté à MySQL 🚀');
});

// routes

app.get('/api/games', (req, res) => {
    db.query('SELECT * FROM Games', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// USERS -------------------------------------


// GET /api/users => liste des utilisateurs
app.get('/users', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM View_Users');
    res.json(rows);
});

// GET /api/users/admins => liste des administrateurs
app.get('/users/admins', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM View_Users_Admins');
    res.json(rows);
});

// POST /api/users => crée un utilisateur
app.post('/users', async (req, res) => {
    const { id_user, username, password_user, level_permission } = req.body;
    try {
        await pool.query('CALL Procedure_Create_User(?, ?, ?, ?)', [
            id_user,
            username,
            password_user,
            level_permission,
        ]);
        res.status(201).json({ message: 'Utilisateur créé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/users/:id => supprime un utilisateur
app.delete('/users/:id', async (req, res) => {
    const id_user = req.params.id;
    try {
        await pool.query('CALL Procedure_Delete_User(?)', [id_user]);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/:id/permission => change le niveau de permission
app.put('/users/:id/permission', async (req, res) => {
    const id_user = req.params.id;
    const { new_permission } = req.body;
    try {
        await pool.query('CALL Procedure_Change_User_Permission(?, ?)', [id_user, new_permission]);
        res.json({ message: 'Permission modifiée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/:id/permission => récupère le niveau de permission
app.get('/users/:id/permission', async (req, res) => {
    const id_user = req.params.id;
    try {
        const [[result]] = await pool.query('SELECT Ft_Check_Permission(?) AS permission', [id_user]);
        res.json({ permission: result.permission });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur Node en écoute sur http://localhost:${PORT}`));
