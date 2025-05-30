const server_url = 'http://localhost:3000';

document.addEventListener("alpine:init", () => {
  // Créez un store global pour le cache avec localStorage
  Alpine.store('gameCache', {
    games: [],
    lastUpdated: null,

    // Charge le cache depuis localStorage
    init() {
      const saved = localStorage.getItem('gameCache');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.games = parsed.games || [];
          this.lastUpdated = parsed.lastUpdated || null;
        } catch (e) {
          console.error("Error parsing cache", e);
          this.clear();
        }
      }
    },

    // Vérifie si le cache est valide (5 minutes)
    isValid() {
      return this.games.length > 0 &&
        this.lastUpdated &&
        (Date.now() - this.lastUpdated < 300000);
    },

    // Sauvegarde les données dans le cache
    save(games) {
      this.games = games;
      this.lastUpdated = Date.now();
      localStorage.setItem('gameCache', JSON.stringify({
        games: this.games,
        lastUpdated: this.lastUpdated
      }));
    },

    // Vide le cache
    clear() {
      this.games = [];
      this.lastUpdated = null;
      localStorage.removeItem('gameCache');
    }
  });

  Alpine.store('gameCache').init();

  Alpine.data("library", () => ({
    // Valeurs initiales
    isLoading: false,
    minRank: 1,
    maxRank: 100,
    minPlayers: 1,
    maxPlayers: 10,
    minPlaytime: 0,
    maxPlaytime: 300,
    minYear: 1900,
    maxYear: new Date().getFullYear(),
    minRating: null,
    minAge: null,
    minReviews: null,
    searchTerm: "",
    selectedCategory: "",
    games: [],
    categories: [],
    usingCache: false,
    isConnected: false,
    isAdmin: false,
    favorites: [],

    // États pour la modale de notation
    ratingModalOpen: false,
    currentGameId: null,
    userRating: 0,
    hoverRating: 0,
    ratedGames: [],
    alreadyRated: false,

    async init() {
      await this.fetchCategories();

      if (Alpine.store('gameCache').isValid()) {
        this.games = Alpine.store('gameCache').games;
        this.usingCache = true;
      } else {
        await this.fetchAllGames();
      }

      // Vérifie si l'utilisateur est connecté
      this.isConnected = !!localStorage.getItem("token");
      if (this.isConnected) {
        await this.fetchFavorites();
        await this.fetchRatedGames();
        await this.checkAdminStatus(); // Nouvelle méthode pour vérifier le statut admin
      }

      this.$nextTick(() => {
        this.initSliders();
      });
    },

    // Méthode pour vérifier le statut admin
    async checkAdminStatus() {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id_user");
      
      if (!token || !userId) {
        this.isAdmin = false;
        return;
      }

      try {
        const response = await fetch(`${server_url}/api/users/${userId}/permission`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Vérifie si la permission est "admin" ou autre valeur selon votre logique
          this.isAdmin = data.permission === 'admin'; 
        } else {
          console.error("Erreur lors de la vérification du statut admin");
          this.isAdmin = false;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        this.isAdmin = false;
      }
    },

    // Méthode pour supprimer un jeu
    async deleteGame(id_game) {
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) return;
      
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour effectuer cette action");
        return;
      }

      try {
        const response = await fetch(`${server_url}/api/games/${id_game}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Erreur lors de la suppression du jeu");

        // Supprime le jeu de la liste locale
        this.games = this.games.filter(game => game.id_game !== id_game);
        // Met à jour le cache
        Alpine.store('gameCache').save(this.games);
        
        alert("Jeu supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression du jeu");
      }
    },

    // Méthodes pour la notation
    openRatingModal(gameId) {
      this.currentGameId = gameId;
      this.userRating = 0;
      this.ratingModalOpen = true;
      this.alreadyRated = this.ratedGames.includes(gameId);
    },

    closeRatingModal() {
      this.ratingModalOpen = false;
    },

    async fetchRatedGames() {
      const id_user = localStorage.getItem("id_user");
      const token = localStorage.getItem("token");
    
      if (!id_user || !token) return;
    
      try {
        const res = await fetch(`${server_url}/api/rates/${id_user}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!res.ok) throw new Error("Erreur récupération des jeux notés");
        const data = await res.json();
        this.ratedGames = data.map(g => g.id_game); // => tableau d'IDs des jeux déjà notés
      } catch (err) {
        console.error("Erreur lors du chargement des notes :", err);
      }
    },    

    async submitRating() {
      if (!this.userRating || !this.currentGameId) return;
    
      const id_user = localStorage.getItem("id_user");
      const token = localStorage.getItem("token");
    
      if (!id_user || !token) {
        alert("Utilisateur non authentifié");
        return;
      }
    
      try {
        const response = await fetch(`${server_url}/api/rates/${this.currentGameId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            id_user: parseInt(id_user),
            rating: this.userRating
          })
        });
    
        if (!response.ok) throw new Error("Erreur lors de l'envoi de la note");
    
        await this.applyFilters();
        this.ratedGames.push(this.currentGameId);
        this.closeRatingModal();
        alert("Merci pour votre note !");
    
      } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de l'envoi de votre note");
      }
    },

    setRating(rating) {
      this.userRating = rating;
    },

    setHoverRating(rating) {
      this.hoverRating = rating;
    },

    resetHoverRating() {
      this.hoverRating = this.userRating;
    },

    // Méthode pour initialiser les sliders
    initSliders() {
      this.updateDualSlider(null, 'minRank', 'maxRank', 'rank-slider', 'rank-bar');
      this.updateDualSlider(null, 'minPlayers', 'maxPlayers', 'players-slider', 'players-bar');
    },

    // Méthode générique pour gérer les dual sliders
    updateDualSlider(event, currentProp, otherProp, containerId, barId) {
      const active = event ? event.target : null;
      const min = currentProp.includes('min') ? this[currentProp] : this[otherProp];
      const max = currentProp.includes('max') ? this[currentProp] : this[otherProp];
      const container = document.getElementById(containerId);
      const bar = document.getElementById(barId);

      // Empêche les curseurs de se croiser
      if (active) {
        if (currentProp.includes('min') && min >= max) {
          this[otherProp] = min + 1;
          if (this[otherProp] > this.getMaxValue(currentProp)) {
            this[otherProp] = this.getMaxValue(currentProp);
          }
        } else if (currentProp.includes('max') && max <= min) {
          this[otherProp] = max - 1;
          if (this[otherProp] < this.getMinValue(currentProp)) {
            this[otherProp] = this.getMinValue(currentProp);
          }
        }
      }

      // Met à jour la barre de sélection
      if (container && bar) {
        const minValue = currentProp.includes('min') ? this[currentProp] : this[otherProp];
        const maxValue = currentProp.includes('max') ? this[currentProp] : this[otherProp];
        const maxRange = this.getMaxValue(currentProp);

        const minRel = minValue / maxRange;
        const maxRel = maxValue / maxRange;
        const totalWidth = container.clientWidth - 18;

        const left = totalWidth * minRel + 9;
        const width = totalWidth * maxRel + 9 - left;

        bar.style.left = left + "px";
        bar.style.width = width + "px";
      }

      // Déclenche la recherche si c'est une interaction utilisateur
      if (event) {
        this.applyFilters();
      }
    },

    // Helper pour obtenir les valeurs max
    getMaxValue(prop) {
      const ranges = {
        'Rank': 100,
        'Players': 10,
        'Playtime': 300,
        'Year': new Date().getFullYear()
      };
      return ranges[prop.replace(/min|max/, '')];
    },

    // Helper pour obtenir les valeurs min
    getMinValue(prop) {
      const ranges = {
        'Rank': 1,
        'Players': 1,
        'Playtime': 0,
        'Year': 1900
      };
      return ranges[prop.replace(/min|max/, '')];
    },

    // Récupère tous les jeux (avec gestion du cache)
    async fetchAllGames() {
      this.isLoading = true;
      this.usingCache = false;

      try {
        const response = await fetch(`${server_url}/api/games`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des jeux");

        const data = await response.json();

        // Mise à jour du cache
        Alpine.store('gameCache').save(data);
        this.games = data;

      } catch (error) {
        console.error("Erreur:", error);

        // Fallback au cache si disponible
        if (Alpine.store('gameCache').games.length > 0) {
          this.games = Alpine.store('gameCache').games;
          this.usingCache = true;
          console.log("Fallback au cache après erreur");
        } else {
          alert("Impossible de charger les jeux");
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Récupère les catégories
    async fetchCategories() {
      try {
        const response = await fetch(`${server_url}/api/categories`);
        if (!response.ok) throw new Error("Erreur de chargement des catégories");
        this.categories = await response.json();
      } catch (error) {
        console.error("Erreur:", error);
      }
    },

    // Applique les filtres (utilise le cache si possible)
    async applyFilters() {
      // Si pas de filtres actifs, utilise le cache
      if (!this.hasActiveFilters() && Alpine.store('gameCache').isValid()) {
        this.games = Alpine.store('gameCache').games;
        this.usingCache = true;
        return;
      }

      this.isLoading = true;
      this.usingCache = false;

      try {
        const params = new URLSearchParams();

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

        const url = `${server_url}/api/games/search?${params.toString()}`;
        console.log("Request URL:", url);
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("Error details:", errorData);
          throw new Error(`Server error: ${response.status}`);
        }

        this.games = await response.json();

        // Si c'est une recherche vide, met à jour le cache
        if (!this.hasActiveFilters()) {
          Alpine.store('gameCache').save(this.games);
        }
      } catch (error) {
        console.error("Full error:", error);

        // Fallback au cache si disponible
        if (Alpine.store('gameCache').games.length > 0) {
          this.games = Alpine.store('gameCache').games;
          this.usingCache = true;
          console.log("Fallback au cache après erreur de recherche");
        } else {
          alert(`Erreur lors de la recherche: ${error.message}`);
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Vérifie si des filtres sont actifs
    hasActiveFilters() {
      return this.searchTerm ||
        this.selectedCategory ||
        this.minRating ||
        this.minRank !== 1 || this.maxRank !== 100 ||
        this.minPlayers !== 1 || this.maxPlayers !== 10 ||
        this.minPlaytime !== 0 || this.maxPlaytime !== 300 ||
        this.minAge ||
        this.minYear !== 1900 || this.maxYear !== new Date().getFullYear() ||
        this.minReviews;
    },

    // Réinitialise les filtres
    resetFilters() {
      this.searchTerm = "";
      this.selectedCategory = "";
      this.minRating = null;
      this.minRank = 1;
      this.maxRank = 100;
      this.minPlayers = 1;
      this.maxPlayers = 10;
      this.minPlaytime = 0;
      this.maxPlaytime = 300;
      this.minAge = null;
      this.minYear = 1900;
      this.maxYear = new Date().getFullYear();
      this.minReviews = null;

      // Utilise le cache si disponible
      if (Alpine.store('gameCache').games.length > 0) {
        this.games = Alpine.store('gameCache').games;
        this.usingCache = true;
      } else {
        this.fetchAllGames();
      }

      this.$nextTick(() => this.initSliders());
    },

    // Formatage des étoiles pour l'affichage
    formatRating(rating) {
      return Math.round(rating || 0);
    },

    async fetchFavorites() {
      try {
        const id_user = localStorage.getItem("id_user");
        const response = await fetch(`${server_url}/api/userslibrary/${id_user}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}` // si tu utilises un token
          }
        });
        if (!response.ok) throw new Error("Erreur chargement favoris");
        const data = await response.json();
        this.favorites = data.map(fav => fav.id_game);
      } catch (error) {
        console.error("Erreur chargement favoris:", error);
      }
    },

    isFavorite(id_game) {
      return this.favorites.includes(id_game);
    },

    async toggleFavorite(id_game) {
      try {
        const id_user = localStorage.getItem("id_user");
        const response = await fetch(`${server_url}/api/userslibrary/${id_user}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ id_game })
        });

        if (!response.ok) throw new Error("Erreur ajout/suppression favori");

        // Si succès, ajoute ou retire localement
        if (this.isFavorite(id_game)) {
          this.favorites = this.favorites.filter(id => id !== id_game);
        } else {
          this.favorites.push(id_game);
        }

      } catch (error) {
        console.error("Erreur ajout/suppression favori:", error);
      }
    },

  }));
});