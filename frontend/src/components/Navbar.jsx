
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [theme, setTheme] = useState(
    () => localStorage.getItem('proofpocket-theme') || 'dark'
  );
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('proofpocket-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  function handleLogout() {
    setProfileOpen(false);
    logout();
    navigate('/login');
  }

  function openSettings() {
    setProfileOpen(false);
    navigate('/settings');
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="ProofPocket home">
          <span className="navbar__logo-icon" aria-hidden="true">🛡️</span>
          <span className="navbar__logo-text">ProofPocket</span>
        </Link>

        {isAuthenticated && (
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
        )}

        <div className="navbar__actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span aria-hidden="true">
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          {isAuthenticated ? (
            <div className="navbar__profile">
              <button
                type="button"
                className="btn btn-secondary btn-sm navbar__profile-trigger"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span aria-hidden="true">👤</span>
                <span>Your Profile</span>
                <span aria-hidden="true">{profileOpen ? '▴' : '▾'}</span>
              </button>

              {profileOpen && (
                <div className="navbar__profile-menu" role="menu">
                  <div className="navbar__profile-info">
                    <span className="navbar__profile-label">
                      Profile name
                    </span>
                    <span className="navbar__profile-name">
                      {user?.name || 'Account'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="navbar__profile-item"
                    role="menuitem"
                    onClick={openSettings}
                  >
                    Settings
                  </button>

                  <button
                    type="button"
                    className="navbar__profile-item navbar__profile-logout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                id="nav-login-link"
                className="btn btn-secondary btn-sm"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                id="nav-signup-link"
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
