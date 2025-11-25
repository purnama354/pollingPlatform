import { BrowserRouter as Router } from "react-router-dom"
import { AppRoutes } from "./App.Routes"
import { NavBar } from "./component/NavBar"
import { AuthProvider } from "./store/AuthContext"
import { useAuth } from "./hooks/useAuth"

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-base-200">
      {isAuthenticated && <NavBar />}
      <main className="container mx-auto py-4">
        <AppRoutes />
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
