const server_url = 'https://boarding-games-server.vercel.app';

(async function checkUser() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const level_permission = localStorage.getItem("username");

    if (!token) {
        alert("Vous n'etes plus connecté, vous allez être redirigé(e) à l'accueil");
        window.location.href = "index.html";
    };
    if (!username) {
        try {
            const response = await fetch(`${server_url}/api/auth/check`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error("Échec de la vérification :", response.status);
                return;
            }

            const resp = await response.json();
            const { username, level_permission, id_user } = resp.data;
            localStorage.setItem("id_user", id_user);
            localStorage.setItem("username", username);
            localStorage.setItem("level_permission", level_permission);

        } catch (error) {
            console.error("Erreur réseau ou serveur :", error);
        }
    }

    const usernameElement = document.getElementById("username");

    if (usernameElement) {
        usernameElement.textContent = username;
    }

    if (level_permission === "admin") {
        console.log("admin");
    }
})();

async function delete_account() {
    if (confirm("Etes vous sur(e) de vouloir supprimer ce compte ?")) {
        const token = localStorage.getItem("token");
        const id_user = localStorage.getItem("id_user");
        console.log(id_user, "fdfd");
        if (!token) {
            alert("Vous n'etes plus connecté, vous allez être redirigé(e) à la page d'accueil");
            window.location.href = "index.html";
        };
        try {
            const response = await fetch(`${server_url}/api/users/${id_user}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error("Échec de la suppression du compte :", response.status);
                return;
            } else if (response.status === 200) {
                alert("Votre compte à été supprimé, vous allez être redirigé(e) à la page d'accueil");
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                localStorage.removeItem("id_user");
                localStorage.removeItem("level_permission");

                window.location.href = "index.html";
            }

        } catch (error) {
            console.error("Erreur réseau ou serveur :", error);
        }
    };
};

(async function fetchFavoriteGames() {
    const token = localStorage.getItem("token");
    const id_user = localStorage.getItem("id_user");

    if (!token || !id_user) {
        console.error("Token ou ID utilisateur manquant");
        return;
    }

    try {
        const response = await fetch(`${server_url}/api/userslibrary/${id_user}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Erreur lors de la récupération des jeux favoris", response.status);
            return;
        }

        const favoriteGames = await response.json();
        displayFavoriteGames(favoriteGames);

    } catch (error) {
        console.error("Erreur réseau ou serveur :", error);
    }
})();

function displayFavoriteGames(games) {
    const contentDiv = document.querySelector('main .content');

    if (!games || games.length === 0) {
        console.log("Aucun jeu en favoris.");
        return;
    }

    // Nettoyer l'ancien contenu (le message "vous n'avez pas de jeux")
    contentDiv.innerHTML = `
        <h1>Mes jeux favoris</h1>
        <div class="grid-favorites"></div>
    `;

    const grid = contentDiv.querySelector('.grid-favorites');

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('favorite-game-card');
        gameCard.innerHTML = `
            <a href="./game-details.html?id=${game.id_game}" id="game-card-link">
                <img src="${game.thumbnail || 'https://via.placeholder.com/100'}" alt="${game.name_game}" loading="lazy" />
                <h4>${game.name_game}</h4>
            </a>
        `;
        grid.appendChild(gameCard);
    });
};

