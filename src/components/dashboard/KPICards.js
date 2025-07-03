import Card from "../ui/Card"
import { DollarSign, Users, Target, Calendar, TrendingUp } from "lucide-react"

const KPICards = ({ data }) => {
  const kpis = [
    {
      title: "Chiffre d'Affaires",
      value: `${data.chiffreAffaires?.toLocaleString("fr-FR") || "0"} FCFA`,
      change: "+12%",
      changeType: "positive",
      icon: DollarSign,
      gradient: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-600",
    },
    {
      title: "Nouveaux Clients",
      value: data.nouveauxClients || 0,
      change: "+3",
      changeType: "positive",
      icon: Users,
      gradient: "from-green-50 to-green-100/50",
      iconBg: "bg-green-600",
    },
    {
      title: "Taux Transformation",
      value: `${Math.round((data.ventesRealisees / data.rdvRealises) * 100) || 0}%`,
      change: "+5%",
      changeType: "positive",
      icon: Target,
      gradient: "from-purple-50 to-purple-100/50",
      iconBg: "bg-purple-600",
    },
    {
      title: "Événements",
      value: data.evenements || 0,
      change: "Participations ce mois",
      changeType: "neutral",
      icon: Calendar,
      gradient: "from-orange-50 to-orange-100/50",
      iconBg: "bg-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card
          key={index}
          className={`border-0 shadow-md bg-gradient-to-br ${kpi.gradient} hover:shadow-lg transition-shadow duration-200`}
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-3 p-6">
            <h3 className={`text-sm font-semibold ${kpi.iconBg.replace("bg-", "text-")}-900`}>{kpi.title}</h3>
            <div className={`w-10 h-10 ${kpi.iconBg} rounded-xl flex items-center justify-center`}>
              <kpi.icon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className={`text-3xl font-bold ${kpi.iconBg.replace("bg-", "text-")}-900 mb-1`}>{kpi.value}</div>
            <div className="flex items-center text-sm">
              {kpi.changeType === "positive" && <TrendingUp className="h-4 w-4 text-green-600 mr-1" />}
              <span className={`${kpi.changeType === "positive" ? "text-green-600" : "text-gray-600"} font-medium`}>
                {kpi.change}
              </span>
              {kpi.changeType === "positive" && <span className="text-gray-600 ml-1">vs mois dernier</span>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default KPICards
