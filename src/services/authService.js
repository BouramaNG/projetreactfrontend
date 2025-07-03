import api from "./api"

class AuthService {
  // Connexion
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password })

      if (response.success && response.token) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        return { success: true, user: response.user }
      }

      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Inscription
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData)

      if (response.success && response.token) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        return { success: true, user: response.user }
      }

      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Déconnexion
  async logout() {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  // Obtenir le profil utilisateur
  async getProfile() {
    try {
      const response = await api.get("/auth/me")
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Mettre à jour le profil
  async updateProfile(userData) {
    try {
      const response = await api.put("/auth/profile", userData)

      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.user))
        return { success: true, user: response.user }
      }

      return { success: false, message: response.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Changer le mot de passe
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      })

      return { success: response.success, message: response.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    return !!(token && user)
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }

  // Obtenir le token
  getToken() {
    return localStorage.getItem("token")
  }
}

export default new AuthService()
