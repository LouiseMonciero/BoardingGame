document.addEventListener('alpine:init', () => {
    Alpine.data('header', () => ({
        links: [
            { text: 'Accueil', href: './accueil.html' },
            { text: 'Bibliothèque', href: './library.html' },
            { text: 'Profile', href: './profile.html' },
            { text: 'Login/Déconnexion', href: './login.html' }
        ]
    }))
})