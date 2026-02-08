import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../styles/Header.css'

const Header = ({ cartCount, user, onLogout }) => {
  const handleLogout = () => {
    onLogout()
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-section">
          <h1 className="logo">💎 Naksh Jewels</h1>
          <p className="tagline">Premium Jewelry Collection</p>
        </Link>

        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            📦 Shop
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => `nav-btn cart-btn ${isActive ? 'active' : ''}`}>
            🛒 Cart ({cartCount})
          </NavLink>

          {user && (
            <NavLink to="/orders" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
              📋 Orders
            </NavLink>
          )}

          {user ? (
            <>
              <span className="nav-btn user-info">
                👤 {user.username}
              </span>
              <button
                className="nav-btn logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
