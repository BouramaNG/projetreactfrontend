"use client"

import { useState } from "react"
import { useData } from "../context/DataContext"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Label from "../components/ui/Label"
import Modal from "../components/ui/Modal"
import { CheckCircle, Target } from "lucide-react"

const DataEntry = () => {
  const { addPerformanceData } = useData()
  const [formData, setFormData] = useState({
    mois: "",
    chiffreAffaires: "",
    nouveauxClients: "",
    rdvRealises: "",
    ventesRealisees: "",
    dossiersMAJ: "",
    completudeDossiers: "",
    evenements: "",
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      ...formData,
      chiffreAffaires: Number.parseInt(formData.chiffreAffaires),
      nouveauxClients: Number.parseInt(formData.nouveauxClients),
      rdvRealises: Number.parseInt(formData.rdvRealises),
      ventesRealisees: Number.parseInt(formData.ventesRealisees),
      dossiersMAJ: Number.parseInt(formData.dossiersMAJ),
      completudeDossiers: Number.parseInt(formData.completudeDossiers),
      evenements: Number.parseInt(formData.evenements),
      tauxTransformation: Math.round(
        (Number.parseInt(formData.ventesRealisees) / Number.parseInt(formData.rdvRealises)) * 100,
      ),
    }

    try {
      await addPerformanceData(data)
      setShowSuccessModal(true)
      
      // Reset form
      setFormData({
        mois: "",
        chiffreAffaires: "",
        nouveauxClients: "",
        rdvRealises: "",
        ventesRealisees: "",
        dossiersMAJ: "",
        completudeDossiers: "",
        evenements: "",
      })
    } catch (error) {
      setErrorMessage(error.message || "Erreur lors de l'enregistrement")
      setShowErrorModal(true)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const tauxTransformation =
    formData.rdvRealises && formData.ventesRealisees
      ? Math.round((Number.parseInt(formData.ventesRealisees) / Number.parseInt(formData.rdvRealises)) * 100)
      : 0

  return (
    <div className="animate-fade-in">
      <Card className="border-0 shadow-lg">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-6">
          <h1 className="text-xl font-semibold text-gray-900">Saisie des Indicateurs Mensuels</h1>
          <p className="text-gray-600 mt-1">Entrez les données de performance pour le mois sélectionné</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="mois">Période de reporting</Label>
                <select
                  id="mois"
                  className="w-full h-12 p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                  value={formData.mois}
                  onChange={(e) => handleChange("mois", e.target.value)}
                  required
                >
                  <option value="">Sélectionner une période</option>
                  <option value="2024-01">Janvier 2025</option>
                  <option value="2025-02">Février 2025</option>
                  <option value="2025-03">Mars 2025</option>
                  <option value="2025-04">Avril 2025</option>
                  <option value="2025-05">Mai 2025</option>
                  <option value="2025-06">Juin 2025</option>
                  <option value="2025-07">Juillet 2025</option>
                  <option value="2025-08">Août 2025</option>
                  <option value="2025-09">Septembre 2025</option>
                  <option value="2025-10">Octobre 2025</option>
                  <option value="2025-11">Novembre 2025</option>
                  <option value="2025-12">Décembre 2024</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="ca">Chiffre d'affaires (FRANC CFA)</Label>
                <Input
                  id="ca"
                  type="number"
                  placeholder="1 000 000"
                  value={formData.chiffreAffaires}
                  onChange={(e) => handleChange("chiffreAffaires", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="clients">Nouveaux clients signés</Label>
                <Input
                  id="clients"
                  type="number"
                  placeholder="23"
                  value={formData.nouveauxClients}
                  onChange={(e) => handleChange("nouveauxClients", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="rdv">Rendez-vous réalisés</Label>
                <Input
                  id="rdv"
                  type="number"
                  placeholder="45"
                  value={formData.rdvRealises}
                  onChange={(e) => handleChange("rdvRealises", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="ventes">Ventes conclues</Label>
                <Input
                  id="ventes"
                  type="number"
                  placeholder="31"
                  value={formData.ventesRealisees}
                  onChange={(e) => handleChange("ventesRealisees", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Taux de transformation</Label>
                <div className="h-12 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 flex items-center">
                  <Target className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-2xl font-bold text-blue-700">{tauxTransformation}%</span>
                  <span className="text-sm text-blue-600 ml-2">calculé automatiquement</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="dossiers">Dossiers CRM mis à jour</Label>
                <Input
                  id="dossiers"
                  type="number"
                  placeholder="156"
                  value={formData.dossiersMAJ}
                  onChange={(e) => handleChange("dossiersMAJ", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="completude">Complétude des dossiers (%)</Label>
                <Input
                  id="completude"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="85"
                  value={formData.completudeDossiers}
                  onChange={(e) => handleChange("completudeDossiers", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="evenements">Participations aux événements</Label>
                <Input
                  id="evenements"
                  type="number"
                  placeholder="8"
                  value={formData.evenements}
                  onChange={(e) => handleChange("evenements", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <Button type="button" variant="outline" className="px-8 h-12">
                Annuler
              </Button>
              <Button
                type="submit"
                className="px-8 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Enregistrer les données
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Modal de succès */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Données enregistrées !"
        message="Vos indicateurs de performance ont été enregistrés avec succès dans la base de données."
        type="success"
      />

      {/* Modal d'erreur */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Erreur d'enregistrement"
        message={errorMessage}
        type="error"
      />
    </div>
  )
}

export default DataEntry
