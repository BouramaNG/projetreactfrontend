"use client"

import { useEffect, useState } from "react"
import { useData } from "../context/DataContext"
import { useAuth } from "../context/AuthContext"
// import KPICards from "../components/dashboard/KPICards"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { RefreshCw } from "lucide-react"
import Button from "../components/ui/Button"

const Dashboard = () => {
  const { user } = useAuth()
  const { kpis, chartData, recentActivity, loading, error, loadInitialData, clearError } = useData()

  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (error) {
      console.error("Erreur dashboard:", error)
    }
  }, [error])

  const handleRefresh = async () => {
    setRefreshing(true)
    clearError()
    await loadInitialData()
    setRefreshing(false)
  }

  if (loading && !kpis.chiffreAffaires) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des performances - WAWTELECOM</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline" className="flex items-center space-x-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>Actualiser</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Erreur de chargement</p>
          <p className="text-sm mt-1">{error}</p>
          <Button onClick={handleRefresh} size="sm" className="mt-2">
            Réessayer
          </Button>
        </div>
      )}

      {/* <KPICards data={kpis} /> */}
    </div>
  )
}

export default Dashboard
