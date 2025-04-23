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
        const response = await fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem("token", data);
            //console.log("Connexion réussie :", data);
            // redirection ou message à l'utilisateur ici
        } else {
            //console.error("Erreur de connexion :", response.status);
            alert("Identifiants incorrects.");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Impossible de contacter le serveur.");
    }

    return false;
}
