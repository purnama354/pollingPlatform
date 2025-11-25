import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { PollCreate } from "./component/PollCreate"
import { PollList } from "./component/PollList"

export function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/polls" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/polls" />}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/polls" /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/polls"
        element={isAuthenticated ? <PollList /> : <Navigate to="/login" />}
      />
      <Route
        path="/polls/create"
        element={isAuthenticated ? <PollCreate /> : <Navigate to="/login" />}
      />
    </Routes>
  )
}
