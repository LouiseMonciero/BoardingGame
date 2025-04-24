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
                const response = await fetch(`http://localhost:5500/api/games/${gameId}`);
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