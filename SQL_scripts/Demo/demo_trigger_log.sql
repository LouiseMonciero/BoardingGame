USE BoardingGames;

-- Update trigger log / Procedure update game
SELECT * FROM logs WHERE description_log NOT LIKE 'Insert Game';

UPDATE Games SET name_game = 'hehe1' WHERE id_game = 5;

CALL Procedure_Update_Game( 5, 'hehe2', NULL, NULL );

SELECT * FROM logs WHERE description_log NOT LIKE 'Insert Game';
