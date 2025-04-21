// client/assets/js/alpine-components/library.js

document.addEventListener("alpine:init", () => {
    Alpine.data("library", () => ({
      games: [],
      searchTerm: "",
      selectedCategory: "",
      categories: [],
  
      async init() {
        await this.fetchCategories();
        await this.fetchAllGames();
      },
  
      async fetchAllGames() {
        try {
          const response = await fetch("http://localhost:5500/api/games");
          if (!response.ok) throw new Error("Erreur lors de la récupération des jeux");
          const data = await response.json();
          this.games = data;
        } catch (error) {
          console.error("Erreur lors du chargement des jeux :", error);
        }
      },
  
      async fetchCategories() {
        try {
          const response = await fetch("http://localhost:5500/api/categories");
          if (!response.ok) throw new Error("Erreur lors de la récupération des catégories");
          const data = await response.json();
          this.categories = data;
        } catch (error) {
          console.error("Erreur lors du chargement des catégories :", error);
        }
      },
  
      async searchGames() {
        try {
          const query = new URLSearchParams();
          if (this.searchTerm.trim()) query.append("search", this.searchTerm);
          if (this.selectedCategory) query.append("category", this.selectedCategory);
  
          const response = await fetch(`http://localhost:5500/api/games?${query.toString()}`);
          if (!response.ok) throw new Error("Erreur lors de la recherche");
          const data = await response.json();
          this.games = data;
        } catch (error) {
          console.error("Erreur lors de la recherche des jeux :", error);
        }
      },
    }));
  });
  