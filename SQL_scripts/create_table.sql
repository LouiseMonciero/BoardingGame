DROP DATABASE IF EXISTS BoardingGames;
CREATE DATABASE BoardingGames;
USE BoardingGames;

-- Table Category
CREATE TABLE Category (
    id_category INT PRIMARY KEY,
    category VARCHAR(255) NOT NULL
);

-- Table Game
CREATE TABLE Game (
    id_game INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (LENGTH(name) > 0),
    year INT,
    URL TEXT,
    thumbnail TEXT,
    description TEXT,
    id_category INT,
    boardgamemechanic TEXT,
    boardgamefamily TEXT,
    boardgameexpansion TEXT,
    boardgameimplementation TEXT,
    boardgamepublisher TEXT,
    boardgameartist TEXT,
    boardgamedesigner TEXT,
    FOREIGN KEY (id_category) REFERENCES Category(id_category)
);

-- Table Rules
CREATE TABLE Rules (
    id_game INT PRIMARY KEY,
    minplayers INT,
    maxplayers INT,
    minplayingtime INT,
    maxplayingtime INT,
    minage INT CHECK (minage >= 0),
    FOREIGN KEY (id_game) REFERENCES Game(id_game),
    CHECK (minplayers <= maxplayers),
    CHECK (minplayingtime IS NULL OR maxplayingtime IS NULL OR minplayingtime <= maxplayingtime)
);

-- Table Rate
CREATE TABLE Rate (
    id_game INT PRIMARY KEY,
    rank INT,
    average DECIMAL(4,2) CHECK (average BETWEEN 0 AND 10),
    bayes_average DECIMAL(4,2) CHECK (bayes_average BETWEEN 0 AND 10),
    users_rated INT CHECK (users_rated >= 0),
    FOREIGN KEY (id_game) REFERENCES Game(id_game)
);

-- Table User
CREATE TABLE User (
    id_user INT PRIMARY KEY,
    name_user VARCHAR(100) NOT NULL UNIQUE,
    password_user VARCHAR(255) NOT NULL,
    level_permission VARCHAR(50) NOT NULL CHECK (level_permission IN ('administrator', 'user'))
);

-- Table Log
CREATE TABLE Log (
    id_log INT PRIMARY KEY,
    description_log TEXT NOT NULL,
    id_user INT NOT NULL,
    id_game INT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK (date <= CURRENT_TIMESTAMP),
    FOREIGN KEY (id_user) REFERENCES User(id_user),
    FOREIGN KEY (id_game) REFERENCES Game(id_game)
);


