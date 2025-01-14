import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./store/AuthContext"
import { AppRoutes } from "./App.Routes"

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
