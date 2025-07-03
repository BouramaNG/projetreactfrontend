"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import DataEntry from "./pages/DataEntry"
import Reports from "./pages/Reports"
import DashboardLayout from "./components/layout/DashboardLayout"
import LoadingSpinner from "./components/ui/LoadingSpinner"
import AllPerformances from "./pages/AllPerformances"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/" element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="saisie" element={<DataEntry />} />
          <Route path="rapports" element={<Reports />} />
          <Route path="all-performances" element={<AllPerformances />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
