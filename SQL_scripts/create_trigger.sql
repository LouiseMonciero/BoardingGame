
CREATE TRIGGER prevent_user_deletion
BEFORE DELETE ON Users
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Logs WHERE id_user = OLD.id_user) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Impossible de supprimer un utilisateur qui a des logs.';
    END IF;
END;
