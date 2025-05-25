-- Demo : DELETE A GAME

-- Comptez les entrées dans tt les tables d'interets.
SELECT 
    (SELECT COUNT(*) FROM Games WHERE name_game = 'Uno') AS nb_games,
    (SELECT COUNT(*) FROM Rates WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_Unotes,
    (SELECT COUNT(*) FROM Belongs WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_belongs,
    (SELECT COUNT(*) FROM Favorites WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_favorites,
    (SELECT COUNT(*) FROM Raters WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_Unoters,
    (SELECT COUNT(*) FROM Logs WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_logs,
    (SELECT COUNT(*) FROM Logs )AS nb_total_logs;

SET SQL_SAFE_UPDATES = 0;
CALL Procedure_Delete_Game((SELECT id_game FROM Games WHERE name_game LIKE 'Uno'));
-- DELETE FROM Games WHERE name_game = 'Ra';


-- Comptez les entrées dans tt les tables d'interets.
SELECT 
    (SELECT COUNT(*) FROM Games WHERE name_game = 'Uno') AS nb_games,
    (SELECT COUNT(*) FROM Rates WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_Unotes,
    (SELECT COUNT(*) FROM Belongs WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_belongs,
    (SELECT COUNT(*) FROM Favorites WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_favorites,
    (SELECT COUNT(*) FROM Raters WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_Unoters,
    (SELECT COUNT(*) FROM Logs WHERE id_game = (SELECT id_game FROM Games WHERE name_game = 'Uno')) AS nb_logs,
    (SELECT COUNT(*) FROM Logs )AS nb_total_logs;





