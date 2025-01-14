import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./store/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"

export function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/polls" /> : <Navigate to="/login" />
        }
      />
    </Routes>
  )
}
