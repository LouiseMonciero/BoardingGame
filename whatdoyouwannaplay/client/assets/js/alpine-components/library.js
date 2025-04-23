document.addEventListener("alpine:init", () => {
  Alpine.data("library", () => ({
      games: [],
      categories: [],
      isLoading: false,
      
      // Filtres
      searchTerm: "",
      selectedCategory: "",
      minRating: null,
      minRank: null,
      maxRank: null,
      minPlayers: null,
      maxPlayers: null,
      minPlaytime: null,
      maxPlaytime: null,
      minAge: null,
      minYear: null,
      maxYear: null,
      minReviews: null,
      
      // Initialisation
      async init() {
          await this.fetchCategories();
          await this.fetchAllGames(); // Charger tous les jeux au départ
      },
      
      // Récupérer tous les jeux (sans filtres)
      async fetchAllGames() {
          this.isLoading = true;
          try {
              const response = await fetch("http://localhost:5500/api/games");
              if (!response.ok) throw new Error("Erreur lors de la récupération des jeux");
              const data = await response.json();
              this.games = data;
          } catch (error) {
              console.error("Erreur:", error);
              alert("Impossible de charger les jeux");
          } finally {
              this.isLoading = false;
          }
      },
      
      // Récupérer les catégories
      async fetchCategories() {
          try {
              const response = await fetch("http://localhost:5500/api/categories");
              if (!response.ok) throw new Error("Erreur de chargement des catégories");
              this.categories = await response.json();
          } catch (error) {
              console.error("Erreur:", error);
          }
      },
      
      // Appliquer les filtres
      async applyFilters() {
        this.isLoading = true;
        try {
            const params = new URLSearchParams();
            
            // Ajouter seulement les filtres définis
            if (this.searchTerm) params.append("search_term", this.searchTerm.trim());
            if (this.selectedCategory) params.append("category", this.selectedCategory);
            if (this.minRating) params.append("min_rating", this.minRating);
            if (this.minRank) params.append("min_rank", this.minRank);
            if (this.maxRank) params.append("max_rank", this.maxRank);
            if (this.minPlayers) params.append("min_players", this.minPlayers);
            if (this.maxPlayers) params.append("max_players", this.maxPlayers);
            if (this.minPlaytime) params.append("min_playtime", this.minPlaytime);
            if (this.maxPlaytime) params.append("max_playtime", this.maxPlaytime);
            if (this.minAge) params.append("min_age", this.minAge);
            if (this.minYear) params.append("min_year", this.minYear);
            if (this.maxYear) params.append("max_year", this.maxYear);
            if (this.minReviews) params.append("min_reviews", this.minReviews);
    
            const url = `http://localhost:5500/api/games/search?${params.toString()}`;
            console.log("Request URL:", url); // Debug log
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("Error details:", errorData);
                throw new Error(`Server error: ${response.status}`);
            }
            
            this.games = await response.json();
        } catch (error) {
            console.error("Full error:", error);
            alert(`Erreur lors de la recherche: ${error.message}`);
        } finally {
            this.isLoading = false;
        }
    },
      
      // Réinitialiser les filtres et charger tous les jeux
      resetFilters() {
          this.searchTerm = "";
          this.selectedCategory = "";
          this.minRating = null;
          this.minRank = null;
          this.maxRank = null;
          this.minPlayers = null;
          this.maxPlayers = null;
          this.minPlaytime = null;
          this.maxPlaytime = null;
          this.minAge = null;
          this.minYear = null;
          this.maxYear = null;
          this.minReviews = null;
          
          this.fetchAllGames(); // Charger tous les jeux après réinitialisation
      },
      
      // Formatage des étoiles pour l'affichage
      formatRating(rating) {
          return Math.round(rating || 0);
      }
  }));
});