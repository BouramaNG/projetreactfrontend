import { Outlet } from "react-router-dom"
import Header from "./Header"
import Navigation from "./Navigation"

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Navigation />
        <main className="mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
