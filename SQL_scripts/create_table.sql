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
   name_game VARCHAR(100) NOT NULL,
   year_game INT,
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
   FOREIGN KEY(id_rules) REFERENCES Rules(id_rules),
   CHECK (LENGTH(name_game) > 0)
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
   PRIMARY KEY(id_log),
   FOREIGN KEY(id_game) REFERENCES Games(id_game),
   FOREIGN KEY(id_user) REFERENCES Users(id_user)
);

CREATE TABLE Favorites(
   id_game INT, 
   id_user INT,
   FOREIGN KEY(id_game) REFERENCES Games(id_game),
   FOREIGN KEY(id_user) REFERENCES Users(id_user)
);

-- Création des vues

CREATE VIEW View_Games AS
SELECT g.id_game, g.name_game, r.average, g.thumbnail
FROM Games g
LEFT JOIN Rates r ON g.id_game = r.id_game;

CREATE VIEW View_GameDetails AS
SELECT g.*, r.minplayers, r.maxplayers, r.minplaytime, r.maxplaytime, r.minage
FROM Games g
JOIN Rules r ON g.id_rules = r.id_rules;

CREATE VIEW View_Logs_Users AS
SELECT l.*, u.username
FROM Logs l
JOIN Users u ON l.id_user = u.id_user;

CREATE VIEW View_Categories AS
SELECT * FROM Categories;

CREATE VIEW View_Users AS
SELECT id_user, username, level_permission FROM Users;

CREATE VIEW View_Users_Admins AS
SELECT * FROM Users WHERE level_permission = 'admin';

-- Création des triggers

DELIMITER //
CREATE TRIGGER Trigger_Log_Game_Insert
AFTER INSERT ON Games
FOR EACH ROW
BEGIN
  INSERT INTO Logs (id_game, id_user, description_log, date_log)
  VALUES (NEW.id_game, NULL, 'Insert game', CURDATE());
END//

CREATE TRIGGER Trigger_Log_Game_Update
AFTER UPDATE ON Games
FOR EACH ROW
BEGIN
  INSERT INTO Logs (id_game, id_user, description_log, date_log)
  VALUES (NEW.id_game, NULL, 'Update game', CURDATE());
END//

CREATE TRIGGER Trigger_Log_Game_Delete
AFTER DELETE ON Games
FOR EACH ROW
BEGIN
  INSERT INTO Logs (id_game, id_user, description_log, date_log)
  VALUES (OLD.id_game, NULL, 'Delete game', CURDATE());
END//

CREATE TRIGGER Trigger_Log_User_Create
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
  INSERT INTO Logs (id_user, id_game, description_log, date_log)
  VALUES (NEW.id_user, NULL, 'Create user', CURDATE());
END//

CREATE TRIGGER Trigger_Log_User_Delete
AFTER DELETE ON Users
FOR EACH ROW
BEGIN
  INSERT INTO Logs (id_user, id_game, description_log, date_log)
  VALUES (OLD.id_user, NULL, 'Delete user', CURDATE());
END//

CREATE TRIGGER Trigger_Log_User_PermissionChange
AFTER UPDATE ON Users
FOR EACH ROW
BEGIN
  IF NEW.level_permission <> OLD.level_permission THEN
    INSERT INTO Logs (id_user, id_game, description_log, date_log)
    VALUES (NEW.id_user, NULL, 'Permission changed', CURDATE());
  END IF;
END//
DELIMITER ;
-- Création des procédures stockées

DELIMITER //
CREATE PROCEDURE Procedure_Create_Game(
  IN p_id_game INT,
  IN p_name_game VARCHAR(100),
  IN p_year_game INT,
  IN p_url VARCHAR(100),
  IN p_thumbnail TEXT,
  IN p_description TEXT,
  IN p_mechanic TEXT,
  IN p_family TEXT,
  IN p_expansion TEXT,
  IN p_implementation TEXT,
  IN p_publisher TEXT,
  IN p_artist TEXT,
  IN p_designer TEXT,
  IN p_id_rules INT
)
BEGIN
  INSERT INTO Games VALUES (p_id_game, p_name_game, p_year_game, p_url, p_thumbnail, p_description,
                            p_mechanic, p_family, p_expansion, p_implementation,
                            p_publisher, p_artist, p_designer, p_id_rules);
END//

CREATE PROCEDURE Procedure_Update_Game(
  IN p_id_game INT,
  IN p_name_game VARCHAR(100),
  IN p_year_game INT,
  IN p_description TEXT
)
BEGIN
  UPDATE Games SET name_game = p_name_game, year_game = p_year_game, description = p_description
  WHERE id_game = p_id_game;
END//

CREATE PROCEDURE Procedure_Delete_Game(
  IN p_id_game INT
)
BEGIN
  DELETE FROM Favorites WHERE id_game = p_id_game;
  DELETE FROM Belongs WHERE id_game = p_id_game;
  DELETE FROM Rates WHERE id_game = p_id_game;
  DELETE FROM Logs WHERE id_game = p_id_game;
  DELETE FROM Games WHERE id_game = p_id_game;
END//

CREATE PROCEDURE Procedure_Search_Games(
  IN p_category VARCHAR(100),
  IN p_min_rating DECIMAL(15,2),
  IN p_rank_max INT
)
BEGIN
  SELECT g.* FROM Games g
  JOIN Belongs b ON g.id_game = b.id_game
  JOIN Categories c ON b.id_category = c.id_category
  JOIN Rates r ON g.id_game = r.id_game
  WHERE c.category LIKE CONCAT('%', p_category, '%')
    AND r.average >= p_min_rating
    AND r.rank <= p_rank_max;
END//

CREATE PROCEDURE Procedure_Get_Game_Info(
  IN p_id_game INT
)
BEGIN
  SELECT * FROM Games WHERE id_game = p_id_game;
END//

CREATE PROCEDURE Procedure_User_Library(
  IN p_id_user INT
)
BEGIN
  SELECT g.* FROM Games g
  JOIN Favorites f ON g.id_game = f.id_game
  WHERE f.id_user = p_id_user;
END//

CREATE PROCEDURE Procedure_Create_User(
  IN p_id_user INT,
  IN p_username VARCHAR(50),
  IN p_password_user VARCHAR(50),
  IN p_level_permission VARCHAR(50)
)
BEGIN
  INSERT INTO Users VALUES (p_id_user, p_username, p_password_user, p_level_permission);
END//

CREATE PROCEDURE Procedure_Delete_User(
  IN p_id_user INT
)
BEGIN
  DELETE FROM Favorites WHERE id_user = p_id_user;
  DELETE FROM Logs WHERE id_user = p_id_user;
  DELETE FROM Users WHERE id_user = p_id_user;
END//

CREATE PROCEDURE Procedure_Change_User_Permission(
  IN p_id_user INT,
  IN p_new_permission VARCHAR(50)
)
BEGIN
  UPDATE Users SET level_permission = p_new_permission
  WHERE id_user = p_id_user;
END//

CREATE PROCEDURE Procedure_Delete_Rate(
  IN p_id_user INT
)
BEGIN
  DELETE FROM Rates WHERE id_rate = p_id_user;
END//

CREATE PROCEDURE Procedure_Add_Game_To_UserLibrary(
  IN p_id_user INT,
  IN p_id_game INT
)
BEGIN
  INSERT INTO Favorites (id_game, id_user) VALUES (p_id_game, p_id_user);
END//
DELIMITER ;

-- Création des transactions

DELIMITER //
CREATE PROCEDURE Transactions_Rate_Game(
  IN p_id_game INT,
  IN p_id_rate INT,
  IN p_rank INT
)
BEGIN
  START TRANSACTION;
    INSERT INTO Rates (id_game, id_rate, rank, average, users_rated)
    VALUES (p_id_game, p_id_rate, p_rank, p_rank, 1)
    ON DUPLICATE KEY UPDATE rank = p_rank;

    UPDATE Rates
    SET average = (SELECT Ft_Get_Average_Rating(p_id_game))
    WHERE id_game = p_id_game;
  COMMIT;
END//
DELIMITER ;

-- Création des fonctions stockées

DELIMITER //
CREATE FUNCTION Ft_Check_Permission(uid INT) RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
  DECLARE role VARCHAR(50);
  SELECT level_permission INTO role FROM Users WHERE id_user = uid;
  RETURN role;
END//

CREATE FUNCTION Ft_Get_Average_Rating(gid INT) RETURNS DECIMAL(15,2)
DETERMINISTIC
BEGIN
  DECLARE avg_rating DECIMAL(15,2);
  SELECT AVG(rank) INTO avg_rating FROM Rates WHERE id_game = gid;
  RETURN avg_rating;
END//
DELIMITER ;
