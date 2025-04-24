document.addEventListener('alpine:init', () => {
    Alpine.data('header', () => ({
        links: [],
        init() {
            const isLoggedIn = localStorage.getItem("token") !== null;

            this.links = [
                { text: 'Accueil', href: './accueil.html' },
                { text: 'Bibliothèque', href: './library.html' },
            ];

            if (isLoggedIn) {
                this.links.push({ text: 'Profil', href: './profile.html' });
                this.links.push({ text: 'Déconnexion', href: '#', onclick: 'logout()' });
            } else {
                this.links.push({ text: 'Login/Signup', href: './login.html' });
            }
        }
    }));
});

// Fonction de déconnexion globale
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
