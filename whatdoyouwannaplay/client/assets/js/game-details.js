const server_url = 'https://boarding-games-server-6cm09k5s7-louisemoncieros-projects.vercel.app';

document.addEventListener('alpine:init', () => {
    Alpine.data('gameDetails', () => ({
        game: null,
        isLoading: true,

        async init() {
            // Récupère l'ID du jeu depuis l'URL
            const urlParams = new URLSearchParams(window.location.search);
            const gameId = urlParams.get('id');

            if (!gameId) {
                this.isLoading = false;
                return;
            }

            try {
                const response = await fetch(`${server_url}/api/games/${gameId}`);
                if (!response.ok) throw new Error('Jeu non trouvé');

                this.game = await response.json();

                // Formatage des listes
                if (this.game) {
                    this.game.mechanics = this.formatList(this.game.boardgamemechanic);
                    this.game.publishers = this.formatList(this.game.boardgamepublisher);
                    this.game.artists = this.formatList(this.game.boardgameartist);
                    this.game.designers = this.formatList(this.game.boardgamedesigner);
                    this.game.categories = this.game.categories ? this.game.categories.split(', ') : [];
                }
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                this.isLoading = false;
            }
        },

        formatList(listString) {
            if (!listString) return [];

            // Supprime les crochets et guillemets si présents
            const cleanedString = listString
                .replace(/^\[|\]$/g, '')  // Enlève les crochets
                .replace(/'/g, '')        // Enlève les guillemets simples
                .replace(/"/g, '');       // Enlève les guillemets doubles

            // Sépare par les virgules suivies d'un saut de ligne ou juste des virgules
            return cleanedString.split(/,\s*\n|,\s*/)
                .map(item => item.trim())
                .filter(item => item.length > 0);
        }
    }));
});