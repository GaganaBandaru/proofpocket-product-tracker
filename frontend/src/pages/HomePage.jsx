import { Link } from 'react-router-dom'
import ProductList from '../components/ProductList'
import './HomePage.css'

export default function HomePage() {
  return (
    <main className="page">
      <div className="container">
        {/* Hero strip */}
        <header className="home-hero fade-in">
          <div className="home-hero__text">
            <h1>Your Product Vault</h1>
            <p className="home-hero__sub">
              Track warranties, monitor service schedules, and log repairs — all in one place.
            </p>
          </div>
          <div className="home-hero__stats" aria-label="Quick stats">
            <div className="home-stat">
              <span className="home-stat__icon">🛡️</span>
              <span className="home-stat__label">Warranty Tracking</span>
            </div>
            <div className="home-stat">
              <span className="home-stat__icon">🔧</span>
              <span className="home-stat__label">Repair History</span>
            </div>
            <div className="home-stat">
              <span className="home-stat__icon">📅</span>
              <span className="home-stat__label">Service Reminders</span>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="page-header">
          <h2>My Products</h2>
          <Link to="/products/new" id="home-add-product-btn" className="btn btn-primary">
            <span aria-hidden="true">＋</span>
            Add Product
          </Link>
        </div>

        {/* Product grid */}
        <ProductList />
      </div>
    </main>
  )
}
