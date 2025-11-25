import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function NavBar() {
  const { logout } = useAuth()

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold">
            Polling Platform
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/polls">Polls</Link>
            </li>
            <li>
              <Link to="/polls/create">Create Poll</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
