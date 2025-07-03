"use client"
import { useAuth } from "../../context/AuthContext"
import { BarChart3 } from "lucide-react"
import Button from "../ui/Button"

const Header = () => {
  const { user, logout } = useAuth()

  const getRoleLabel = (role) => {
    const roles = {
      admin: "Administrateur",
      manager: "Manager",
    }
    return roles[role] || "Utilisateur"
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mr-4 shadow-md">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WAWTELECOM
              </h1>
              <p className="text-sm text-gray-500">Tableau de bord commercial</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{user?.initials}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.prenom && user?.nom
                    ? `${user.prenom} ${user.nom}`
                    : user?.nomComplet || user?.name || "Utilisateur"}
                </p>
                <p className="text-xs text-gray-500">{getRoleLabel(user?.role)}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="border-gray-200 hover:bg-gray-50">
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
