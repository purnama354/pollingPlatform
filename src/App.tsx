import { BrowserRouter as Router, useLocation } from "react-router-dom"
import { AppRoutes } from "./App.Routes"
import { NavBar } from "./component/NavBar"
import { AuthProvider } from "./store/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { useAuth } from "./hooks/useAuth"

function AppContent() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Hide navbar on public pages
  const publicRoutes = ['/', '/login', '/register']
  const showNavbar = isAuthenticated || !publicRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen bg-base-200">
      {isAuthenticated && <NavBar />}
      <main className={isAuthenticated ? "container mx-auto py-4" : ""}>
        <AppRoutes />
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
