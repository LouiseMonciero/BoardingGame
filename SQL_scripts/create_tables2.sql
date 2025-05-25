
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

CREATE TRIGGER Trigger_Update_Rank
AFTER INSERT ON Rates
FOR EACH ROW
BEGIN
    CALL UpdateRanks();
END//

CREATE TRIGGER Trigger_Update_Rank_Update
AFTER UPDATE ON Rates
FOR EACH ROW
BEGIN
    CALL UpdateRanks();
END//

CREATE TRIGGER Trigger_Update_Rank_Delete
AFTER DELETE ON Rates
FOR EACH ROW
BEGIN
    CALL UpdateRanks();
END//