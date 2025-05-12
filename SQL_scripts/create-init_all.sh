#!/bin/bash

# Consignes d'exécution :
# Utiliser un invite de commande bash
# Git Bash ou WSL sur Windows, sinon celui par défaut sur Linux et MacOS
# Placez-vous dans le répertoire avec les fichiers SQL : cd <votre chemin d'accès>
# Exécuter ces commandes en retirant le signe '$' :
# $ chmod +x create-init_all.sh
# $ ./create-init_all.sh
# Exécuter le fichier init_all.sql afin de créer et remplir la base de données

# Liste des fichiers SQL à compiler
sql_files=(
    "create_table.sql"
    "insert_rules.sql"
    "insert_games.sql"
    "insert_user.sql"
    "insert_rates.sql"
    "insert_categories.sql"
    "insert_belongs.sql"
)

# Nom du fichier de sortie
output_file="init_all.sql"

# Vérifier si le fichier de sortie existe déjà et le supprimer
if [ -f "$output_file" ]; then
    rm "$output_file"
fi

# Compiler les fichiers SQL dans l'ordre avec des commentaires
for file in "${sql_files[@]}"; do
    if [ -f "$file" ]; then
        # Ajouter un commentaire pour indiquer le début du fichier
        echo "--------------------------------------------------" >> "$output_file"
        echo "-- Contenu du fichier : $file" >> "$output_file"
        echo "--------------------------------------------------" >> "$output_file"
        # Ajouter le contenu du fichier
        cat "$file" >> "$output_file"
        echo "Ajout de $file à $output_file"
    else
        echo "Fichier $file non trouvé"
    fi
done

echo "-- Script exécuté avec succès" >> "$output_file"
echo "SELECT 'Tout s''est exécuté correctement.' AS Message;" >> "$output_file"

echo "Compilation terminée. Le fichier $output_file a été créé."
