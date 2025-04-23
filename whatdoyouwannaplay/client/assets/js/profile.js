(async function checkUser() {
    const token = localStorage.getItem("token");
    if (!token) return; // Si pas de token, on ne fait rien

    try {
        const response = await fetch("http://localhost:3000/api/auth/check", {
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
        const { username, level_permission } = resp.data;

        const usernameElement = document.getElementById("username");
        if (usernameElement) {
            usernameElement.textContent = username;
        }

        if (level_permission === "admin") {
            console.log("admin");
        }

    } catch (error) {
        console.error("Erreur réseau ou serveur :", error);
    }
})();
