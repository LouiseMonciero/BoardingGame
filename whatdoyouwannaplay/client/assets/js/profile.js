import { server_url } from "./assets/js/config.js";


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
}
