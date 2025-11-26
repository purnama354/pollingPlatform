import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Home } from "./pages/Home"
import { PollCreate } from "./component/PollCreate"
import { PollList } from "./component/PollList"
import { PollVote } from "./component/PollVote"

export function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={!isAuthenticated ? <Home /> : <Navigate to="/polls" />}
      />
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/polls" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/polls" />}
      />

      {/* Protected Routes */}
      <Route
        path="/polls"
        element={isAuthenticated ? <PollList /> : <Navigate to="/" />}
      />
      <Route
        path="/polls/create"
        element={isAuthenticated ? <PollCreate /> : <Navigate to="/" />}
      />
      <Route
        path="/polls/:id"
        element={isAuthenticated ? <PollVote /> : <Navigate to="/" />}
      />
    </Routes>
  )
}
