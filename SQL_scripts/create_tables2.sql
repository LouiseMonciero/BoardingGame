-- Triggers to create after the insert of all entries.
DELIMITER //

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