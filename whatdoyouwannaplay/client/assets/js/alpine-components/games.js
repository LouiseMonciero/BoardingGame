document.addEventListener('alpine:init', () => {
    Alpine.data('library', () => ({
        searchQuery: '',
        games: [
            {
                id: 1,
                title: 'Monopoly',
                image: 'https://via.placeholder.com/100',
                stars: '⭐⭐⭐⭐',
            },
            {
                id: 2,
                title: 'Risk',
                image: 'https://via.placeholder.com/100',
                stars: '⭐⭐⭐',
            },
            {
                id: 3,
                title: 'Loup-Garous',
                image: 'https://via.placeholder.com/100',
                stars: '⭐⭐⭐⭐⭐',
            },
            // Add more game objects or fetch from DB/API
        ],
        filteredGames: [],
        init() {
            this.filteredGames = this.games;
        },
        filterGames() {
            const query = this.searchQuery.toLowerCase();
            this.filteredGames = this.games.filter((game) =>
                game.title.toLowerCase().includes(query)
            );
        },
    }));
});