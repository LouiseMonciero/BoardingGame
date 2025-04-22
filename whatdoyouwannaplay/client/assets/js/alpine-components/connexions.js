document.addEventListener('alpine:init', () => {
    Alpine.data('user_connexion', () => ({
      // états liés au formulaire
      user_id: '',
      user_password: '',
      // URL de base de ton API
      API_BASE: 'http://localhost:5500/api/auth',
  
      // méthode appelée au submit
      async login() {
        try {
          const res = await fetch(`${this.API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: this.user_id,
              password: this.user_password
            })
          });
  
          if (!res.ok) {
            // erreur renvoyée par le back
            const err = await res.json();
            return alert(`Erreur : ${err.message || res.statusText}`);
          }
  
          // récupération du token
          const { token } = await res.json();
          localStorage.setItem('auth_token', token);
  
          // redirige vers la page d’accueil ou tableau de bord
          window.location.href = './accueil.html';
        } catch (e) {
          console.error(e);
          alert('Impossible de se connecter pour le moment.');
        }
      }
    }));
  });