# BoardingGame

A website to have boarding games

## Installation Font-end

-   npm install alpinjs
    ou
-   <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

## Installation Back-end

1. Lancer les commandes suivantes :

-   npm init -y
-   npm install express mysql2 cors
-   npm install --save-dev nodemon

2. Ajouter cela a package.json

```
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

3. Lancer le serveur avec :

-   npm run dev

## DataBase Usage

Number of entry : 21630

The sql srcipts to build the database can be found in SQL_scripts. They can be run in this order :

1. create_table.sql
2. insert_rules.sql
3. insert_games.sql
4. insert_rates.sql
5. insert_categories.sql
6. insert_belongs.sql
