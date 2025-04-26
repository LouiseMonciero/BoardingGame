#!/bin/bash

# Consignes d'execution :

# utiliser un invite de commande bash
# git bash ou WSL sur Windows, sinon celui par défaut sur Linux et MaxOs
# Placez vous dans le répertoir avec les fichier sql : cd <votre chemin d'acces>

# executer ces commandes en retirant le signe '$':

# $chmod +x create-init_all.sh
# $ ./create-init_all.sh

# exectuer le fichier init_all.sql afin de créer et remplir la base de donnée



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

# Compiler les fichiers SQL dans l'ordre
for file in "${sql_files[@]}"; do
    if [ -f "$file" ]; then
        cat "$file" >> "$output_file"
        echo "Ajouté $file à $output_file"
    else
        echo "Fichier $file non trouvé"
    fi
done

echo "Compilation terminée. Le fichier $output_file a été créé."
