import axios from "axios"

// Configuration de base d'Axios
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api"

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }

    // Retourner l'erreur formatée
    const errorMessage = error.response?.data?.message || error.message || "Une erreur est survenue"
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    })
  },
)

// Ajouter des données de performance
export const postPerformance = async (performanceData) => {
  return api.post("/performance", performanceData);
};

export default api
