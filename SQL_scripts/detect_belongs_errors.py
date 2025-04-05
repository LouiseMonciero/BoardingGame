def extract_ids_from_file(file_path):
    ids = set()
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("("):
                try:
                    id_part = line.split(",")[0].replace("(", "").strip()
                    ids.add(int(id_part))
                except ValueError:
                    pass  # ignore lines that don't match
    return ids

def find_invalid_lines(file1_path, file2_path):
    ids_file1 = extract_ids_from_file(file1_path)

    with open(file2_path, "r", encoding="utf-8") as f2:
        for line_number, line in enumerate(f2, start=1):
            line = line.strip()
            if line.startswith("("):
                try:
                    id_part = line.split(",")[0].replace("(", "").strip()
                    if int(id_part) not in ids_file1:
                        print(f"❌ Ligne {line_number} : ID {id_part} n'existe pas dans le fichier 1")
                except ValueError:
                    print(f"⚠️ Ligne {line_number} malformée : {line}")

# --- Exécution ---
file1 = "/Users/louise_monciero/Desktop/Louise/Code/BoardingGame/BoardingGame/SQL_scripts//insert_games.sql"
file2 = "/Users/louise_monciero/Desktop/Louise/Code/BoardingGame/BoardingGame/SQL_scripts//insert_belongs.sql"

find_invalid_lines(file1, file2)
