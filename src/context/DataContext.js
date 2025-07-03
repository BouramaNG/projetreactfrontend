"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { postPerformance } from "../services/api"
import authService from "../services/authService"
import api from "../services/api"
import { useAuth } from "./AuthContext"

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export const DataProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const [performanceData, setPerformanceData] = useState([])
  const [users, setUsers] = useState([
    {
      id: 1,
      nom: "Ngom",
      prenom: "Bourama",
      email: "bourama@wawtelecom.com",
      role: "Manager",
      statut: "Actif",
      derniereConnexion: "Il y a 2h",
    },
    {
      id: 2,
      nom: "Ndour",
      prenom: "Marie",
      email: "marie@wawtelecom.com",
      role: "Utilisateur",
      statut: "Actif",
      derniereConnexion: "Il y a 1 jour",
    },
    {
      id: 3,
      nom: "Fall",
      prenom: "Binta",
      email: "bintad@wawtelecom.com",
      role: "Utilisateur",
      statut: "Inactif",
      derniereConnexion: "Il y a 7 jours",
    },
  ])

  const [currentMonthData, setCurrentMonthData] = useState({
    chiffreAffaires: 125430,
    nouveauxClients: 23,
    rdvRealises: 45,
    ventesRealisees: 31,
    dossiersMAJ: 156,
    totalDossiers: 200,
    completudeDossiers: 85,
    evenements: 8,
  })

  // Données étendues pour les graphiques
  const [chartData, setChartData] = useState([])
  const [salesByProduct, setSalesByProduct] = useState([])
  const [monthlyTrends, setMonthlyTrends] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Nouvelle fonction pour charger les données réelles
  const fetchPerformanceData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get("/performance")
      setPerformanceData(res.data || [])
      setChartData(res.data || [])
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  // Nouvelle version de addPerformanceData
  const addPerformanceData = async (data) => {
    setLoading(true)
    setError(null)
    try {
      // Transformation des données pour le backend
      const [annee, mois] = data.mois.split("-")
      const payload = {
        periode: { annee: parseInt(annee), mois: parseInt(mois) },
        chiffreAffaires: data.chiffreAffaires,
        objectifCA: data.chiffreAffaires * 0.9, // ou à adapter selon logique métier
        nouveauxClients: data.nouveauxClients,
        rdvRealises: data.rdvRealises,
        ventesRealisees: data.ventesRealisees,
        dossiersMAJ: data.dossiersMAJ,
        totalDossiers: 200, // à adapter si tu veux le rendre dynamique
        evenements: data.evenements,
        satisfaction: 4.0, // à adapter si tu veux le rendre dynamique
      }
      await postPerformance(payload)
      await fetchPerformanceData() // Rafraîchir les données après ajout
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return // attendre que l'auth soit chargée
    if (user) {
      fetchPerformanceData()
    }
  }, [user, authLoading])

  useEffect(() => {
    if (authLoading) return // attendre que l'auth soit chargée
    if (!user) {
      // Données de performance mensuelles étendues
      const mockData = [
        {
          mois: "2023-11",
          monthName: "Nov 23",
          chiffreAffaires: 78500,
          nouveauxClients: 14,
          rdvRealises: 32,
          ventesRealisees: 20,
          tauxTransformation: 62,
          crmCompletude: 73,
          evenements: 3,
          objectifCA: 75000,
          satisfaction: 4.0,
        },
        {
          mois: "2023-12",
          monthName: "Déc 23",
          chiffreAffaires: 82300,
          nouveauxClients: 15,
          rdvRealises: 33,
          ventesRealisees: 21,
          tauxTransformation: 64,
          crmCompletude: 74,
          evenements: 4,
          objectifCA: 80000,
          satisfaction: 4.1,
        },
        {
          mois: "2024-01",
          monthName: "Jan 24",
          chiffreAffaires: 89600,
          nouveauxClients: 16,
          rdvRealises: 35,
          ventesRealisees: 22,
          tauxTransformation: 63,
          crmCompletude: 75,
          evenements: 4,
          objectifCA: 85000,
          satisfaction: 4.2,
        },
        {
          mois: "2024-02",
          monthName: "Fév 24",
          chiffreAffaires: 94300,
          nouveauxClients: 19,
          rdvRealises: 37,
          ventesRealisees: 24,
          tauxTransformation: 65,
          crmCompletude: 77,
          evenements: 6,
          objectifCA: 90000,
          satisfaction: 4.3,
        },
        {
          mois: "2024-03",
          monthName: "Mar 24",
          chiffreAffaires: 105200,
          nouveauxClients: 21,
          rdvRealises: 40,
          ventesRealisees: 28,
          tauxTransformation: 70,
          crmCompletude: 80,
          evenements: 7,
          objectifCA: 95000,
          satisfaction: 4.4,
        },
        {
          mois: "2024-04",
          monthName: "Avr 24",
          chiffreAffaires: 98750,
          nouveauxClients: 18,
          rdvRealises: 38,
          ventesRealisees: 25,
          tauxTransformation: 66,
          crmCompletude: 82,
          evenements: 5,
          objectifCA: 100000,
          satisfaction: 4.1,
        },
        {
          mois: "2024-05",
          monthName: "Mai 24",
          chiffreAffaires: 112850,
          nouveauxClients: 20,
          rdvRealises: 42,
          ventesRealisees: 26,
          tauxTransformation: 62,
          crmCompletude: 78,
          evenements: 6,
          objectifCA: 105000,
          satisfaction: 4.5,
        },
        {
          mois: "2024-06",
          monthName: "Juin 24",
          chiffreAffaires: 118900,
          nouveauxClients: 22,
          rdvRealises: 44,
          ventesRealisees: 29,
          tauxTransformation: 66,
          crmCompletude: 83,
          evenements: 8,
          objectifCA: 110000,
          satisfaction: 4.6,
        },
        {
          mois: "2024-07",
          monthName: "Juil 24",
          chiffreAffaires: 108500,
          nouveauxClients: 19,
          rdvRealises: 41,
          ventesRealisees: 27,
          tauxTransformation: 66,
          crmCompletude: 81,
          evenements: 7,
          objectifCA: 108000,
          satisfaction: 4.3,
        },
        {
          mois: "2024-08",
          monthName: "Août 24",
          chiffreAffaires: 95200,
          nouveauxClients: 17,
          rdvRealises: 36,
          ventesRealisees: 23,
          tauxTransformation: 64,
          crmCompletude: 79,
          evenements: 5,
          objectifCA: 95000,
          satisfaction: 4.2,
        },
        {
          mois: "2024-09",
          monthName: "Sep 24",
          chiffreAffaires: 121300,
          nouveauxClients: 24,
          rdvRealises: 46,
          ventesRealisees: 32,
          tauxTransformation: 70,
          crmCompletude: 85,
          evenements: 9,
          objectifCA: 115000,
          satisfaction: 4.7,
        },
        {
          mois: "2024-10",
          monthName: "Oct 24",
          chiffreAffaires: 114600,
          nouveauxClients: 21,
          rdvRealises: 43,
          ventesRealisees: 29,
          tauxTransformation: 67,
          crmCompletude: 82,
          evenements: 6,
          objectifCA: 112000,
          satisfaction: 4.4,
        },
        {
          mois: "2024-11",
          monthName: "Nov 24",
          chiffreAffaires: 128700,
          nouveauxClients: 25,
          rdvRealises: 48,
          ventesRealisees: 34,
          tauxTransformation: 71,
          crmCompletude: 87,
          evenements: 8,
          objectifCA: 120000,
          satisfaction: 4.8,
        },
        {
          mois: "2024-12",
          monthName: "Déc 24",
          chiffreAffaires: 135430,
          nouveauxClients: 27,
          rdvRealises: 52,
          ventesRealisees: 37,
          tauxTransformation: 71,
          crmCompletude: 89,
          evenements: 10,
          objectifCA: 125000,
          satisfaction: 4.9,
        },
      ]

      setPerformanceData(mockData)
      setChartData(mockData)

      // Données par produit/service
      const productData = [
        { name: "Consulting", value: 45, color: "#3b82f6" },
        { name: "Formation", value: 25, color: "#10b981" },
        { name: "Support", value: 20, color: "#8b5cf6" },
        { name: "Audit", value: 10, color: "#f59e0b" },
      ]
      setSalesByProduct(productData)

      // Tendances mensuelles
      const trends = mockData.map((item) => ({
        mois: item.monthName,
        croissance: ((item.chiffreAffaires - item.objectifCA) / item.objectifCA) * 100,
        performance: item.tauxTransformation,
        satisfaction: item.satisfaction,
      }))
      setMonthlyTrends(trends)
    }
  }, [user, authLoading])

  const updateUser = (userId, userData) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...userData } : user)))
  }

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Math.max(...users.map((u) => u.id)) + 1,
      statut: "Actif",
      derniereConnexion: "Jamais",
    }
    setUsers((prev) => [...prev, newUser])
  }

  // Calcul automatique des KPIs globaux
  const kpis = {
    chiffreAffaires: performanceData.reduce((sum, d) => sum + (d.chiffreAffaires || 0), 0),
    nouveauxClients: performanceData.reduce((sum, d) => sum + (d.nouveauxClients || 0), 0),
    rdvRealises: performanceData.reduce((sum, d) => sum + (d.rdvRealises || 0), 0),
    ventesRealisees: performanceData.reduce((sum, d) => sum + (d.ventesRealisees || 0), 0),
    dossiersMAJ: performanceData.reduce((sum, d) => sum + (d.dossiersMAJ || 0), 0),
    totalDossiers: performanceData.reduce((sum, d) => sum + (d.totalDossiers || 0), 0),
    evenements: performanceData.reduce((sum, d) => sum + (d.evenements || 0), 0),
    satisfaction: performanceData.length > 0 ? (performanceData.reduce((sum, d) => sum + (d.satisfaction || 0), 0) / performanceData.length).toFixed(1) : 0,
  };

  const value = {
    performanceData,
    currentMonthData,
    users,
    chartData,
    salesByProduct,
    monthlyTrends,
    addPerformanceData,
    updateUser,
    deleteUser,
    addUser,
    loading,
    error,
    kpis,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
