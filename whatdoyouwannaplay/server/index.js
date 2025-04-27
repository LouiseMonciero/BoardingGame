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
    origin: [
        'https://boarding-game.vercel.app',
        'http://localhost:3000' // Exemple d'URL autorisée supplémentaire, peut être remplacée par d'autres URL d'hebergeurs frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
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

// Génération dynamique de config.js pour le front
app.get('/config.js', (req, res) => {
    res.type('application/javascript');
    res.send(`server_url = "${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3000}`}";`);
});

app.get('/', (req, res) => {
    res.send("Connected and deployed !!")
})

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur Node en écoute sur ${PORT}\nAccès front: https://boarding-game.vercel.app`));
