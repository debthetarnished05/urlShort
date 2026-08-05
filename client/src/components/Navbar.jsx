import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <NavLink to="/" className="navbar-logo">
          url<span>Short</span>
        </NavLink>

    
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAuthenticated ? (
            <>
             
              <ul className="navbar-links">
                <li>
                  <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-urls" className={({ isActive }) => isActive ? 'active' : ''}>
                    My URLs
                  </NavLink>
                </li>
              </ul>

           
              <div className="navbar-user">
                <div className="navbar-avatar">{initials}</div>
                <span className="navbar-username">{user?.name?.split(' ')[0]}</span>
              </div>

              <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="logout-btn">
                Sign Out
              </button>
            </>
          ) : (
            <NavLink to="/auth" className="btn btn-primary btn-sm" id="signin-nav-btn">
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
