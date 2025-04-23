
async function login(event) {
    event.preventDefault();

    const username = document.getElementById("user_id").value.trim();
    const password = document.getElementById("user_password").value.trim();

    const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        alert(`Erreur : ${error.message || response.statusText}`);
        return;
    }

    const { token } = await response.json();
    localStorage.setItem("auth_token", token);
    window.location.href = "accueil.html";
}

