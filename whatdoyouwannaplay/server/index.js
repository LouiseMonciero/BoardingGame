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

// Exemple : liste des jeux
app.get('/api/games', (req, res) => {
    db.query('SELECT * FROM Games', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur Node en écoute sur http://localhost:${PORT}`));
