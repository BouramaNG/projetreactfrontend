import { NavLink, Link } from "react-router-dom"
import { BarChart3, Plus, FileText, Settings } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useLocation } from "react-router-dom"

const Navigation = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navItems = [
    { path: "/dashboard", label: "Tableau de bord", icon: BarChart3 },
    { path: "/saisie", label: "Saisie données", icon: Plus },
    { path: "/rapports", label: "Rapports", icon: FileText },
  ]

  return (
    <nav className="bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm rounded-lg p-1">
      <div className="grid grid-cols-3 gap-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`
            }
          >
            <Icon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{label}</span>
          </NavLink>
        ))}
        {(user?.role === "admin" || user?.role === "manager") && (
          <Link
            to="/all-performances"
            className={`flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              location.pathname === "/all-performances" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Vue d'ensemble
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navigation
