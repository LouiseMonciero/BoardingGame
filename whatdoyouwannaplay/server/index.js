const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Charger les variables d'environnement

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur Node en écoute sur http://localhost:${PORT}`));
