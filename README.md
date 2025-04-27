# BoardingGame

A website to have boarding games

## Deployement
The project is deployed on [vercel](https://vercel.com/) and accessible at the following adresses : 
- https://boarding-game-zeta.vercel.app/ for the webpage
- https://boarding-games-server.vercel.app/ for the backend api

## Run the project locally
This project has been created for production only but if you want to run it locally follow the instruction below

### 1. Clone the repository
Run the following command to clone the repository
`git clone 'https://github.com/LouiseMonciero/BoardingGame.git'`

### 2. Generate the Database
Number of entries : 21630

The sql srcipts to build the database can be found in SQL_scripts. They can be run in this order :

1. create_table.sql
2. insert_rules.sql
3. insert_games.sql
4. insert_user.sql
5. insert_rates.sql
6. insert_categories.sql
7. insert_belongs.sql

### 3. Run the server
Acess the directory of the server
`cd whatdoyouwannaplay/server`

Run the following command to install all dependencies
`npm i` or `npm install`

Configure your .env file (your .env should be looking as below)
```
# Database configuration
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
SECRET_KEY=...

# Server port
PORT=...
```

Start the server using the following command 
`npm run start` or `npm run dev`

Those logs should appear : 
```
Serveur Node en écoute sur [PORT]
Accès front: https://boarding-game.vercel.app
Connected to MySQL
```

### Configure the front-end :
To configure the front-end for your purpose you can change the variable `serveur_url`
