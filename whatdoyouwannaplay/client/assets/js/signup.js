const server_url = 'https://boarding-games-server.vercel.app';

async function signin(event) {
    event.preventDefault();
    console.log("eze");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const credentials = {
        username: username,
        password: password
    };

    try {
        const signup_response = await fetch(`${server_url}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        if (signup_response.status === 201) {
            document.getElementById("formMessage").innerHTML = "Création du compte réussi.";
            // login automatiquement
            const data = await signup_response.json();
            //localStorage.setItem("token", data);
            // Connexion automatique
            const login_response = await fetch(`${server_url}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            });
        
            if (!(login_response.status === 200)) {
                const error = await login_response.json();
                alert(`Erreur : ${error.message || login_response.statusText}`);
                return;
            }
        
            const { sessionToken: token, userId, level_permission } = await login_response.json();
            localStorage.setItem("token", token);
            localStorage.setItem("id_user", userId);
            localStorage.setItem("username", username);
            localStorage.setItem("level_permission", level_permission);
            window.location.href = "index.html";
        } else {
            document.getElementById("formMessage").innerHTML = "<p><strong>Cet identifiant est déjà pris.</strong><p>";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("formMessage").innerHTML = "<p><strong>Impossible de contacter le serveur.</strong><p>";
    }
    return false;
}
