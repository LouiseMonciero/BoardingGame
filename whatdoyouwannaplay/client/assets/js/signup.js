const server_url = 'https://boarding-games-server-6cm09k5s7-louisemoncieros-projects.vercel.app';

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
        const response = await fetch(`${server_url}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        if (response.status === 201) {
            document.getElementById("formMessage").innerHTML = "Création du compte réussi.";
            // login automatiquement
            const data = await response.json();
            //localStorage.setItem("token", data);
        } else {
            document.getElementById("formMessage").innerHTML = "<p><strong>Cet identifiant est déjà pris.</strong><p>";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("formMessage").innerHTML = "<p><strong>Impossible de contacter le serveur.</strong><p>";
    }
    return false;
}
