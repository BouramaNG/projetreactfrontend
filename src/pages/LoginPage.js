"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { BarChart3, Eye, EyeOff } from "lucide-react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Label from "../components/ui/Label"
import Modal from "../components/ui/Modal"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [welcomeUser, setWelcomeUser] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login(email, password)
      if (result.success) {
        setWelcomeUser(result.user)
        setShowWelcomeModal(true)
        // Redirection automatique après 3 secondes
        setTimeout(() => {
          setShowWelcomeModal(false)
          navigate("/dashboard")
        }, 3000)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("Erreur lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false)
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-2xl border-0 glass">
          <div className="text-center pb-8 pt-8">
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              WAWTELECOM
            </h1>
            <p className="text-gray-600 mt-2 text-base">Plateforme de suivi des performances commerciales</p>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}

              <div className="space-y-3">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@wawtelecom.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-12"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-12 px-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Modal de bienvenue */}
      <Modal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeClose}
        title={`Bienvenue, ${welcomeUser?.prenom || 'Utilisateur'} !`}
        message="Connexion réussie. Vous allez être redirigé vers votre tableau de bord dans quelques secondes..."
        type="success"
        showCloseButton={false}
      />
    </div>
  )
}

export default LoginPage
