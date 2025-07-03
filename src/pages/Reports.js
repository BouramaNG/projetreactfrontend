"use client";

import { useData } from "../context/DataContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import CustomLineChart from "../components/charts/LineChart";
import CustomBarChart from "../components/charts/BarChart";
import CustomAreaChart from "../components/charts/AreaChart";
import {
  Download,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
} from "lucide-react";
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

const Reports = () => {
  const { performanceData, chartData, monthlyTrends } = useData();

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text("Rapport de performances commerciales", 14, 16)
    const tableColumn = [
      "Mois",
      "Chiffre d'affaires",
      "Objectif CA",
      "Nouveaux clients",
      "RDV réalisés",
      "Ventes réalisées",
      "Dossiers MAJ",
      "Total dossiers",
      "Evénements",
      "Satisfaction"
    ]
    const tableRows = performanceData.map((d) => [
      d.mois || d.periodeFormatee || d.periode?.mois + "/" + d.periode?.annee,
      d.chiffreAffaires,
      d.objectifCA,
      d.nouveauxClients,
      d.rdvRealises,
      d.ventesRealisees,
      d.dossiersMAJ,
      d.totalDossiers,
      d.evenements,
      d.satisfaction
    ])
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 22 })
    doc.save("rapport_performance.pdf")
  };

  const handleExportExcel = () => {
    const wsData = [
      [
        "Mois",
        "Chiffre d'affaires",
        "Objectif CA",
        "Nouveaux clients",
        "RDV réalisés",
        "Ventes réalisées",
        "Dossiers MAJ",
        "Total dossiers",
        "Evénements",
        "Satisfaction"
      ],
      ...performanceData.map((d) => [
        d.mois || d.periodeFormatee || d.periode?.mois + "/" + d.periode?.annee,
        d.chiffreAffaires,
        d.objectifCA,
        d.nouveauxClients,
        d.rdvRealises,
        d.ventesRealisees,
        d.dossiersMAJ,
        d.totalDossiers,
        d.evenements,
        d.satisfaction
      ])
    ]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Rapport")
    XLSX.writeFile(wb, "rapport_performance.xlsx")
  };

  // Calculs d'analyses avancées
  const totalCA = performanceData.reduce(
    (sum, d) => sum + (d.chiffreAffaires || 0),
    0
  );
  const totalClients = performanceData.reduce(
    (sum, d) => sum + (d.nouveauxClients || 0),
    0
  );
  const avgTransformation = Math.round(
    performanceData.reduce((sum, d) => sum + (d.tauxTransformation || 0), 0) /
      performanceData.length
  );
  const avgSatisfaction = (
    performanceData.reduce((sum, d) => sum + (d.satisfaction || 0), 0) /
    performanceData.length
  ).toFixed(1);

  // Tendances
  const caGrowth =
    performanceData.length >= 2
      ? (
          ((performanceData[0]?.chiffreAffaires -
            performanceData[1]?.chiffreAffaires) /
            performanceData[1]?.chiffreAffaires) *
          100
        ).toFixed(1)
      : 0;

  const clientGrowth =
    performanceData.length >= 2
      ? (
          ((performanceData[0]?.nouveauxClients -
            performanceData[1]?.nouveauxClients) /
            performanceData[1]?.nouveauxClients) *
          100
        ).toFixed(1)
      : 0;

  // Configuration des graphiques pour les rapports
  const revenueConfig = [
    { dataKey: "chiffreAffaires", color: "#3b82f6", name: "CA Réalisé (FCFA)" },
    { dataKey: "objectifCA", color: "#10b981", name: "Objectif (FCFA)" },
  ];

  const performanceConfig = [
    {
      dataKey: "tauxTransformation",
      color: "#8b5cf6",
      name: "Transformation (%)",
    },
    { dataKey: "satisfaction", color: "#f59e0b", name: "Satisfaction" },
  ];

  const clientsConfig = [
    { dataKey: "nouveauxClients", color: "#3b82f6", name: "Nouveaux clients" },
    { dataKey: "ventesRealisees", color: "#10b981", name: "Ventes réalisées" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Rapports et Analyses
          </h1>
          <p className="text-gray-600 mt-1">
            Analyses détaillées et insights business
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* KPI Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  CA Total Annuel
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalCA.toLocaleString("fr-FR")} FCFA
                </p>
                <div className="flex items-center mt-1">
                  {caGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      caGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {caGrowth}%
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">
                  Clients Acquis
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {totalClients}
                </p>
                <div className="flex items-center mt-1">
                  {clientGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      clientGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {clientGrowth}%
                  </span>
                </div>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900">
                  Taux Moyen
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {avgTransformation}%
                </p>
                <p className="text-sm text-purple-700">Transformation</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100/50">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900">
                  Satisfaction
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {avgSatisfaction}/5
                </p>
                <p className="text-sm text-orange-700">Note moyenne</p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Graphiques d'analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Évolution du Chiffre d'Affaires
            </h2>
            <p className="text-gray-600 mt-1">
              Réalisé vs Objectifs sur 12 mois
            </p>
          </div>
          <div className="p-6">
            <CustomAreaChart
              data={chartData}
              areas={revenueConfig}
              height={300}
            />
          </div>
        </Card>

        <Card className="border-0 shadow-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Performance Commerciale
            </h2>
            <p className="text-gray-600 mt-1">
              Taux de transformation et satisfaction
            </p>
          </div>
          <div className="p-6">
            <CustomLineChart
              data={chartData}
              lines={performanceConfig}
              height={300}
            />
          </div>
        </Card>

        <Card className="border-0 shadow-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Acquisition Clients
            </h2>
            <p className="text-gray-600 mt-1">
              Nouveaux clients vs ventes réalisées
            </p>
          </div>
          <div className="p-6">
            <CustomBarChart
              data={chartData}
              bars={clientsConfig}
              height={300}
            />
          </div>
        </Card>

        <Card className="border-0 shadow-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Synthèse Mensuelle
            </h2>
            <p className="text-gray-600 mt-1">
              Analyse automatique des performances
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800">Points Forts</h4>
                </div>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    CA annuel: {totalCA.toLocaleString("fr-FR")}FCFA (+
                    {caGrowth}%)
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Taux de transformation moyen: {avgTransformation}%
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Satisfaction client: {avgSatisfaction}/5
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                <div className="flex items-center mb-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                  <h4 className="font-semibold text-orange-800">
                    Recommandations
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Optimiser le processus de qualification des leads
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Renforcer le suivi post-vente pour la satisfaction
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau détaillé */}
      <Card className="border-0 shadow-md">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Historique Détaillé des Performances
          </h2>
          <p className="text-gray-600 mt-1">
            Données mensuelles complètes avec analyses
          </p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Période
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    CA (FCFA)
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Objectif
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Clients
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Transformation
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Satisfaction
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {performanceData.slice(0, 6).map((data, index) => {
                  const performance =
                    ((data.chiffreAffaires - data.objectifCA) /
                      data.objectifCA) *
                    100;
                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {new Date(data.mois + "-01").toLocaleDateString(
                            "fr-FR",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </div>
                        {index === 0 && (
                          <div className="text-sm text-gray-500">
                            Mois actuel
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">
                          {data.chiffreAffaires?.toLocaleString("fr-FR")}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-700">
                          {data.objectifCA?.toLocaleString("fr-FR")}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {data.nouveauxClients}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">
                          {data.tauxTransformation}%
                        </div>
                        <div
                          className={`text-sm ${
                            data.tauxTransformation >= 65
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          {data.tauxTransformation >= 65 ? "Excellent" : "Bon"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">
                          {data.satisfaction?.toFixed(1)}/5
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="secondary"
                          className={
                            performance >= 10
                              ? "bg-green-100 text-green-800 border-green-200"
                              : performance >= 0
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {performance >= 10
                            ? "Excellent"
                            : performance >= 0
                            ? "Objectif atteint"
                            : "À améliorer"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
