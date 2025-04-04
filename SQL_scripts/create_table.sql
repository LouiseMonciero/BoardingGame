-- Active: 1743769586279@@127.0.0.1@3306@BoardingGames
DROP DATABASE IF EXISTS BoardingGames;
CREATE DATABASE BoardingGames;
USE BoardingGames;

CREATE TABLE Rules(
   id_rules INT PRIMARY KEY,
   minplayers INT,
   maxplayers INT,
   minplaytime INT,
   maxplaytime INT,
   minage INT CHECK (minage >= 0)
);

CREATE TABLE Categories(
   id_category INT PRIMARY KEY,
   category VARCHAR(100) NOT NULL
);

CREATE TABLE Users(
   id_user INT PRIMARY KEY,
   username VARCHAR(50) UNIQUE,
   password_user VARCHAR(50),
   level_permission VARCHAR(50)
);

CREATE TABLE Games(
   id_game INT PRIMARY KEY,
   name_game VARCHAR(100) NOT NULL CHECK (LENGTH(name) > 0),
   year_game YEAR,
   url VARCHAR(100),
   thumbnail TEXT,
   description TEXT,
   boardgamemechanic TEXT,
   boardgamefamily TEXT,
   boardgameexpansion TEXT,
   boardgameimplementation TEXT,
   boardgamepublisher TEXT,
   boardgameartist TEXT,
   boardgamedesigner TEXT,
   id_rules INT NOT NULL,
   FOREIGN KEY(id_rules) REFERENCES Rules(id_rules)
);

CREATE TABLE Rates(
   id_game INT,
   id_rate INT,
   rank INT,
   average DECIMAL(15,2),
   users_rated DECIMAL(15,2),
   PRIMARY KEY(id_game, id_rate),
   UNIQUE(id_game),
   FOREIGN KEY(id_game) REFERENCES Games(id_game)
);

CREATE TABLE Belongs(
   id_game INT,
   id_category INT,
   PRIMARY KEY(id_game, id_category),
   FOREIGN KEY(id_game) REFERENCES Games(id_game),
   FOREIGN KEY(id_category) REFERENCES Categories(id_category)
);

CREATE TABLE Logs(
   id_game INT,
   id_user INT,
   id_log INT,
   description_log VARCHAR(50),
   date_log DATE,
   PRIMARY KEY(id_game, id_user),
   FOREIGN KEY(id_game) REFERENCES Games(id_game),
   FOREIGN KEY(id_user) REFERENCES Users(id_user)
);