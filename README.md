# BoardingGame

A website to have boarding games

## Running the project localy

## Installation Front-end

-   npm install alpinjs
    ou
-   <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

## Install/Run Back-end

Dans le sous dossier whatdoyouwannaplay/server/

```
cd .\whatdoyouwannaplay\server\
```

1. Exécuter les commandes suivantes :

-   npm init -y
-   npm install express mysql2 cors dotenv bcrypt jsonwebtoken morgan
-   npm install --save-dev nodemon

2. Modifier les scripts de lancement dans package.json situé dans .\whatdoyouwannaplay\server\

```
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
},
```

3. Lancer le serveur avec :

-   npm run dev (en mode developpement)
-   npm run start (sinon)

## DataBase Usage

Number of entry : 21630

The sql srcipts to build the database can be found in SQL_scripts. They can be run in this order :

1. create_table.sql
2. insert_rules.sql
3. insert_games.sql
4. insert_user.sql
5. insert_rates.sql
6. insert_categories.sql
7. insert_belongs.sql

Or run ```init_all.sql```