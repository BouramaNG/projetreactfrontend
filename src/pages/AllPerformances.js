import { useEffect, useState } from "react"
import api from "../services/api"
import Card from "../components/ui/Card"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { useAuth } from "../context/AuthContext"
import CustomAreaChart from "../components/charts/AreaChart"
import CustomLineChart from "../components/charts/LineChart"
import CustomBarChart from "../components/charts/BarChart"

const AllPerformances = () => {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await api.get("/performance/all")
        setData(res.data || [])
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des performances")
      } finally {
        setLoading(false)
      }
    }
    if (user && (user.role === "admin" || user.role === "manager")) {
      fetchAll()
    }
  }, [user])

  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Accès interdit</h2>
          <p className="text-gray-700">Vous n'avez pas les droits pour accéder à la vue d'ensemble.</p>
        </Card>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="p-8 text-red-600">{error}</div>

  // Préparation des données pour les graphiques
  const chartData = data.map((perf) => ({
    ...perf,
    monthName: perf.periode
      ? `${perf.periode.mois.toString().padStart(2, "0")}/${perf.periode.annee}`
      : "",
    tauxTransformation:
      perf.rdvRealises && perf.rdvRealises > 0
        ? Math.round((perf.ventesRealisees / perf.rdvRealises) * 100)
        : 0,
  }))

  const revenueConfig = [
    { dataKey: "chiffreAffaires", color: "#3b82f6", name: "CA Réalisé (FCFA)" },
    { dataKey: "objectifCA", color: "#10b981", name: "Objectif (FCFA)" },
  ]
  const performanceConfig = [
    { dataKey: "tauxTransformation", color: "#8b5cf6", name: "Transformation (%)" },
    { dataKey: "satisfaction", color: "#f59e0b", name: "Satisfaction" },
  ]
  const clientsConfig = [
    { dataKey: "nouveauxClients", color: "#3b82f6", name: "Nouveaux clients" },
    { dataKey: "ventesRealisees", color: "#10b981", name: "Ventes réalisées" },
  ]

  return (
    <div className="p-8 animate-fade-in">
      {/* Graphiques d'analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-0 shadow-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Évolution du Chiffre d'Affaires</h2>
            <p className="text-gray-600 mt-1">Réalisé vs Objectifs</p>
          </div>
          <div className="p-6">
            <CustomAreaChart data={chartData} areas={revenueConfig} height={300} />
          </div>
        </Card>
        <Card className="border-0 shadow-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Performance Commerciale</h2>
            <p className="text-gray-600 mt-1">Taux de transformation et satisfaction</p>
          </div>
          <div className="p-6">
            <CustomLineChart data={chartData} lines={performanceConfig} height={300} />
          </div>
        </Card>
        <Card className="border-0 shadow-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Acquisition Clients</h2>
            <p className="text-gray-600 mt-1">Nouveaux clients vs ventes réalisées</p>
          </div>
          <div className="p-6">
            <CustomBarChart data={chartData} bars={clientsConfig} height={300} />
          </div>
        </Card>
      </div>
      {/* Tableau des performances */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Vue d'ensemble des performances</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2">Utilisateur</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Rôle</th>
                <th className="border px-3 py-2">Période</th>
                <th className="border px-3 py-2">Chiffre d'affaires</th>
                <th className="border px-3 py-2">Objectif CA</th>
                <th className="border px-3 py-2">Nouveaux clients</th>
                <th className="border px-3 py-2">RDV réalisés</th>
                <th className="border px-3 py-2">Ventes réalisées</th>
                <th className="border px-3 py-2">Dossiers MAJ</th>
                <th className="border px-3 py-2">Total dossiers</th>
                <th className="border px-3 py-2">Evénements</th>
                <th className="border px-3 py-2">Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={13} className="text-center py-4 text-gray-500">Aucune donnée trouvée.</td>
                </tr>
              )}
              {data.map((perf) => (
                <tr key={perf._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-medium">
                    {perf.utilisateur?.prenom} {perf.utilisateur?.nom}
                  </td>
                  <td className="border px-3 py-2">{perf.utilisateur?.email}</td>
                  <td className="border px-3 py-2">{perf.utilisateur?.role}</td>
                  <td className="border px-3 py-2">
                    {perf.periode?.mois?.toString().padStart(2, "0")}/{perf.periode?.annee}
                  </td>
                  <td className="border px-3 py-2">{perf.chiffreAffaires}</td>
                  <td className="border px-3 py-2">{perf.objectifCA}</td>
                  <td className="border px-3 py-2">{perf.nouveauxClients}</td>
                  <td className="border px-3 py-2">{perf.rdvRealises}</td>
                  <td className="border px-3 py-2">{perf.ventesRealisees}</td>
                  <td className="border px-3 py-2">{perf.dossiersMAJ}</td>
                  <td className="border px-3 py-2">{perf.totalDossiers}</td>
                  <td className="border px-3 py-2">{perf.evenements}</td>
                  <td className="border px-3 py-2">{perf.satisfaction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default AllPerformances 