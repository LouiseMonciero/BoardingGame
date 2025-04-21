const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Charger les variables d'environnement , si besoin dans un bahs executer : $npm install dotenv

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
    console.log('Connected to MySQL');
});


// Routes pour les jeux
const gamesRoutes = require('./routes/games');
const usersRoutes = require('./routes/users');
const logsRoutes = require('./routes/logs');
const ratesRoutes = require('./routes/rates');
const categoriesRoutes = require('./routes/categories');
const usersLibraryRoutes = require('./routes/users_library');



app.use('/api/games', gamesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/rates', ratesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/userslibrary', usersLibraryRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT || 3000, () => console.log(`Serveur Node en écoute sur http://localhost:${PORT}`));
