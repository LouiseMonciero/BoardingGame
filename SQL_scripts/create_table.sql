DROP DATABASE IF EXISTS BoardingGames;
CREATE DATABASE BoardingGames;
USE BoardingGames;

-- Table Category
CREATE TABLE Categories (
    id_category INT PRIMARY KEY,
    category VARCHAR(255) NOT NULL
);

-- Table Game
CREATE TABLE Games (
    id_game INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (LENGTH(name) > 0),
    year_game INT,
    URL VARCHAR(100),
    thumbnail VARCHAR(100),
    description TEXT,
    id_category INT,
    boardgamemechanic TEXT,
    boardgamefamily TEXT,
    boardgameexpansion TEXT,
    boardgameimplementation TEXT,
    boardgamepublisher TEXT,
    boardgameartist TEXT,
    boardgamedesigner TEXT,
    id_rules INT NOT NULL,
    FOREIGN KEY(id_rules) REFERENCES Rules(id_rules)
    FOREIGN KEY (id_category) REFERENCES Category(id_category) ON DELETE CASCADE
);


-- Table Rules
CREATE TABLE Rules (
    id_game INT PRIMARY KEY,
    minplayers INT,
    maxplayers INT,
    minplayingtime INT,
    maxplayingtime INT,
    minage INT CHECK (minage >= 0),
    FOREIGN KEY (id_game) REFERENCES Game(id_game) ON DELETE CASCADE,
    CHECK (minplayers <= maxplayers),
    CHECK (minplayingtime IS NULL OR maxplayingtime IS NULL OR minplayingtime <= maxplayingtime)
);

-- Table Rate
CREATE TABLE Rates(
   id_game INT,
   id_rate INT,
   rank_rate INT,
   average DECIMAL(15,2),
   users_rated DECIMAL(15,2),
   PRIMARY KEY(id_game, id_rate),
   UNIQUE(id_game),
   FOREIGN KEY(id_game) REFERENCES Games(id_game)
);

-- Table Belongs
CREATE TABLE Belongs(
    id_game INT,
    id_category INT,
    PRIMARY KEY(id_game, id_category),
    FOREIGN KEY(id_game) REFERENCES Games(id_game),
    FOREIGN KEY(id_category) REFERENCES Categories(id_category)
);

-- Table User
CREATE TABLE Users (
    id_user INT PRIMARY KEY,
    name_user VARCHAR(50) NOT NULL UNIQUE,
    password_user VARCHAR(50) NOT NULL,
    level_permission VARCHAR(50) NOT NULL CHECK (level_permission IN ('administrator', 'user'))
);

-- Table Log
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


