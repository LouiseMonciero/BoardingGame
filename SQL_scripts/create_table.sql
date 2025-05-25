DROP DATABASE IF EXISTS BoardingGames;
CREATE DATABASE BoardingGames;
USE BoardingGames;

CREATE TABLE Rules(
   id_rules INT PRIMARY KEY AUTO_INCREMENT,
   minplayers INT,
   maxplayers INT,
   minplaytime INT,
   maxplaytime INT,
   minage INT CHECK (minage >= 0)
) AUTO_INCREMENT = 0;

CREATE TABLE Categories(
   id_category INT PRIMARY KEY,
   category VARCHAR(100) NOT NULL
);

CREATE TABLE Users(
   id_user INT PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(50) UNIQUE,
   password_user VARCHAR(255) NOT NULL,
   level_permission VARCHAR(50)
);

CREATE TABLE Games(
   id_game INT PRIMARY KEY AUTO_INCREMENT,
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
   FOREIGN KEY(id_rules) REFERENCES Rules(id_rules) ON DELETE CASCADE,
   CHECK (LENGTH(name_game) > 0)
);

CREATE TABLE Rates(
   id_rate INT AUTO_INCREMENT PRIMARY KEY,
   id_game INT,
   `rank` INT,
   average DECIMAL(15,2),
   users_rated DECIMAL(15,2),
   FOREIGN KEY(id_game) REFERENCES Games(id_game) ON DELETE CASCADE
);
CREATE INDEX idx_rates_id_game ON Rates(id_game);

CREATE TABLE Belongs(
   id_game INT,
   id_category INT,
   PRIMARY KEY(id_game, id_category),
   FOREIGN KEY(id_game) REFERENCES Games(id_game) ON DELETE CASCADE,
   FOREIGN KEY(id_category) REFERENCES Categories(id_category) ON DELETE CASCADE
);

CREATE TABLE Logs(
   id_game INT NULL,
   id_user INT NULL,
   id_log INT AUTO_INCREMENT,
   description_log VARCHAR(50),
   date_log DATE,
   PRIMARY KEY(id_log),
   -- Les clés etrangeres sont supprimé pour ne pas entrainer la suppression des logs à la suppression des jeux ou des utilisateurs
   -- FOREIGN KEY(id_game) REFERENCES Games(id_game) ON DELETE SET NULL, 
   -- FOREIGN KEY(id_user) REFERENCES Users(id_user) ON DELETE SET NULL
);

CREATE TABLE Favorites(
   id_game INT, 
   id_user INT,
   PRIMARY KEY(id_game, id_user),
   FOREIGN KEY(id_game) REFERENCES Games(id_game) ON DELETE CASCADE,
   FOREIGN KEY(id_user) REFERENCES Users(id_user) ON DELETE CASCADE
);

CREATE TABLE Raters(
   id_rate INT,
   id_game INT,
   id_user INT,
   PRIMARY KEY(id_rate, id_user),
   FOREIGN KEY(id_rate) REFERENCES Rates(id_rate),
   FOREIGN KEY(id_game) REFERENCES Games(id_game),
   FOREIGN KEY(id_user) REFERENCES Users(id_user)
);


-- Création des vues

CREATE VIEW View_Games AS
SELECT g.id_game, g.name_game, r.average, r.users_rated, r.rank, g.thumbnail
FROM Games g
LEFT JOIN Rates r ON g.id_game = r.id_game;

CREATE VIEW View_GameDetails AS
SELECT
  g.id_game, g.name_game, g.year_game, g.thumbnail, g.description, g.boardgamemechanic, g.boardgamepublisher, g.boardgameartist, g.boardgamedesigner,
  r.minplayers, r.maxplayers, r.minplaytime, r.maxplaytime, r.minage,
  rt.average, rt.users_rated, rt.rank,
  GROUP_CONCAT(DISTINCT c.category SEPARATOR ', ') AS categories
FROM Games g
JOIN Rules r ON g.id_rules = r.id_rules
LEFT JOIN Rates rt ON g.id_game = rt.id_game
LEFT JOIN Belongs b ON g.id_game = b.id_game
LEFT JOIN Categories c ON b.id_category = c.id_category
GROUP BY g.id_game;

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

CREATE VIEW View_Rates_id AS
SELECT id_rate, id_game FROM Rates;

CREATE VIEW View_Raters AS
SELECT id_user, id_game FROM Raters;

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

CREATE TRIGGER Trigger_Log_Game_Delete -- FIX // Suppression des clées étrangères dans TALBE Logs
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

CREATE TRIGGER Trigger_Log_User_Delete -- FIX // Suppression des clées étrangères dans TALBE Logs
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
  -- 1. Crée le jeu
  INSERT INTO Games (
    name_game, year_game, url, thumbnail, description,
    boardgamemechanic, boardgamefamily, boardgameexpansion,
    boardgameimplementation, boardgamepublisher, boardgameartist,
    boardgamedesigner, id_rules
  ) VALUES (
    p_name_game, p_year_game, p_url, p_thumbnail, p_description,
    p_mechanic, p_family, p_expansion, p_implementation, p_publisher,
    p_artist, p_designer, p_id_rules
  );

  -- 2. Crée l'entrée Rates associée (id_rate auto-incrémenté)
  INSERT INTO Rates (id_game, average, users_rated, `rank`)
  VALUES (LAST_INSERT_ID(), 0, 0, 9999);
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
  -- les diverse delete on cascade permette de faciliter les instructions de deletions
  DELETE FROM Games WHERE id_game = p_id_game;
END//

CREATE PROCEDURE Procedure_Search_Games(
  IN p_search_term VARCHAR(100),
  IN p_category VARCHAR(100),
  IN p_min_rating DECIMAL(15,2),
  IN p_min_rank INT,
  IN p_max_rank INT,
  IN p_min_players INT,
  IN p_max_players INT,
  IN p_min_playtime INT,
  IN p_max_playtime INT,
  IN p_min_age INT,
  IN p_min_year INT,
  IN p_max_year INT,
  IN p_min_reviews INT
)
BEGIN
  -- Debug: Affiche les paramètres reçus
  SELECT CONCAT('Search term: ', IFNULL(p_search_term, 'NULL')) AS debug;
  SELECT 
    g.id_game,
    g.name_game,
    g.year_game,
    g.thumbnail,
    r.average,
    r.rank,
    r.users_rated,
    rules.minplayers,
    rules.maxplayers,
    rules.minplaytime,
    rules.maxplaytime,
    rules.minage,
    GROUP_CONCAT(DISTINCT c.category SEPARATOR ', ') AS categories
  FROM Games g
  JOIN Rates r ON g.id_game = r.id_game
  JOIN Rules rules ON g.id_rules = rules.id_rules
  LEFT JOIN Belongs b ON g.id_game = b.id_game
  LEFT JOIN Categories c ON b.id_category = c.id_category
  WHERE (p_search_term IS NULL OR g.name_game LIKE CONCAT('%', p_search_term, '%'))
    AND (p_category IS NULL OR c.category LIKE CONCAT('%', p_category, '%'))
    AND (p_min_rating IS NULL OR r.average >= p_min_rating)
    AND (p_min_rank IS NULL OR r.rank >= p_min_rank)
    AND (p_max_rank IS NULL OR r.rank <= p_max_rank)
    AND (p_min_players IS NULL OR rules.minplayers >= p_min_players)
    AND (p_max_players IS NULL OR rules.maxplayers <= p_max_players)
    AND (p_min_playtime IS NULL OR rules.minplaytime >= p_min_playtime)
    AND (p_max_playtime IS NULL OR rules.maxplaytime <= p_max_playtime)
    AND (p_min_age IS NULL OR rules.minage >= p_min_age)
    AND (p_min_year IS NULL OR g.year_game >= p_min_year)
    AND (p_max_year IS NULL OR g.year_game <= p_max_year)
    AND (p_min_reviews IS NULL OR r.users_rated >= p_min_reviews)
  GROUP BY g.id_game
  ORDER BY r.rank ASC;
END//

CREATE PROCEDURE Procedure_Get_Game_Info(
  IN p_id_game INT
)
BEGIN
  SELECT * FROM View_GameDetails WHERE id_game = p_id_game;
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
  IN p_username VARCHAR(50),
  IN p_password_user VARCHAR(255),
  IN p_level_permission VARCHAR(50)
)
BEGIN
  INSERT INTO Users(username, password_user, level_permission) VALUES (p_username, p_password_user, p_level_permission);
END//

CREATE PROCEDURE Procedure_Delete_User(
  IN p_id_user INT
)
BEGIN
  SET FOREIGN_KEY_CHECKS = 0;
  DELETE FROM Favorites WHERE id_user = p_id_user;
  -- DELETE FROM Logs WHERE id_user = p_id_user;
  DELETE FROM Users WHERE id_user = p_id_user;
  SET FOREIGN_KEY_CHECKS = 1;
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
  IN p_id_user INT,
  IN p_rate DECIMAL(15,2)
)
BEGIN
  DECLARE already_rated INT DEFAULT 0;

  START TRANSACTION;

    -- Vérifie si l'utilisateur a déjà noté ce jeu
    SELECT COUNT(*) INTO already_rated
    FROM Raters
    WHERE id_game = p_id_game AND id_rate = p_id_rate AND id_user = p_id_user;

    -- S’il n’a pas encore noté, on insère dans Raters
    IF already_rated = 0 THEN
      INSERT INTO Raters (id_game, id_rate, id_user)
      VALUES (p_id_game, p_id_rate, p_id_user);

      -- Met à jour la moyenne pondérée et le nombre d’utilisateurs ayant noté
      UPDATE Rates
      SET average = (average * users_rated + p_rate) / (users_rated + 1),
          users_rated = users_rated + 1
      WHERE id_game = p_id_game AND id_rate = p_id_rate;
    END IF;
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

CREATE FUNCTION Ft_Get_Average_Rating(gid INT) RETURNS DECIMAL(15,2) -- used in Transactions_Rate_Game
DETERMINISTIC
BEGIN
  DECLARE avg_rating DECIMAL(15,2);
  SELECT AVG(`rank`) INTO avg_rating FROM Rates WHERE id_game = gid;
  RETURN avg_rating;
END//
DELIMITER ;

-- Création des indexes
CREATE INDEX idx_name_game ON Games(name_game);
CREATE INDEX idx_year_game ON Games(year_game);

CREATE INDEX idx_rate_game ON Rates(id_game);
CREATE INDEX idx_rate_rank ON Rates(`rank`);
CREATE INDEX idx_rate_avg ON Rates(average);

CREATE INDEX idx_belongs_category ON Belongs(id_category);

CREATE INDEX idx_users_permission ON Users(level_permission);

CREATE INDEX idx_logs_date ON Logs(date_log);
