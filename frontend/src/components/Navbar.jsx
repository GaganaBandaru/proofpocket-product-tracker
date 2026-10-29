
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()

  const [theme, setTheme] = useState(
    () => localStorage.getItem('proofpocket-theme') || 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('proofpocket-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(current => current === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="ProofPocket home">
          <span className="navbar__logo-icon" aria-hidden="true">🛡️</span>
          <span className="navbar__logo-text">ProofPocket</span>
        </Link>

        <ul className="navbar__links" role="list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Products
            </NavLink>
          </li>
        </ul>

        <div className="navbar__actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <button
            id="nav-add-product-btn"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/products/new')}
          >
            <span aria-hidden="true">＋</span>
            Add Product
          </button>
        </div>
      </div>
    </nav>
  )
}
