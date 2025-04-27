const server_url = 'https://boarding-games-server.vercel.app/';

async function login(event) {
    event.preventDefault();

    const username = document.getElementById("id_user").value.trim();
    const password = document.getElementById("user_password").value.trim();

    const response = await fetch(`${server_url}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!(response.status === 200)) {
        const error = await response.json();
        alert(`Erreur : ${error.message || response.statusText}`);
        return;
    }

    const { sessionToken: token, userId, level_permission } = await response.json();
    localStorage.setItem("token", token);
    localStorage.setItem("id_user", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("level_permission", level_permission);
    window.location.href = "index.html";
}

