const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, '../client')));

app.use(cors({
    origin: 'https://boarding-game-zeta.vercel.app', // URL de votre site client
    methods: ['GET', 'POST', 'PUT', 'DELETE'],       // Méthodes HTTP autorisées
    credentials: true                                // Autoriser les cookies et autres credentials
}));


app.use(express.json());
app.use(bodyParser.json());
app.use(logger('dev'));

// Connexion MySQL
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

// Routes API
const gamesRoutes = require('./routes/games');
const usersRoutes = require('./routes/users');
const logsRoutes = require('./routes/logs');
const ratesRoutes = require('./routes/rates');
const categoriesRoutes = require('./routes/categories');
const usersLibraryRoutes = require('./routes/users_library');
const authRoutes = require('./routes/auth');

app.use('/api/games', gamesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/rates', ratesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/userslibrary', usersLibraryRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Connected and deployed !!")
})

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur Node en écoute sur ${PORT}\nAccès front: https://boarding-game.vercel.app`));
