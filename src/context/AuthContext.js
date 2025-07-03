"use client"

import { createContext, useContext, useState, useEffect } from "react"
import authService from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler la vérification de l'authentification
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password)
      if (result.success) {
        setUser(result.user)
        localStorage.setItem("user", JSON.stringify(result.user))
        // Le token est déjà stocké par authService.login
        return { success: true, user: result.user }
      } else {
        return { success: false, error: result.message || "Identifiants invalides" }
      }
    } catch (error) {
      return { success: false, error: error.message || "Erreur de connexion" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
