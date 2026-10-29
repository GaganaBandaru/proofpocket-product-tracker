import { useMemo } from 'react'
import './DashboardStats.css'

/**
 * Calculates days remaining until a given date relative to local midnight.
 * Returns null if the date is missing or invalid.
 */
function getDaysUntil(dateValue, today) {
  if (!dateValue) return null
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return null

  // Normalize target date to local midnight
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

export default function DashboardStats({ products = [], loading = false }) {
  const stats = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let activeWarranties = 0
    let expiringSoonWarranties = 0
    let upcomingServices = 0
    let overdueServices = 0

    for (const p of safeProducts) {
      // Warranty status evaluation
      const wDays = getDaysUntil(p.warrantyExpiry, today)
      if (wDays !== null && wDays >= 0) {
        activeWarranties += 1
        if (wDays <= 30) {
          expiringSoonWarranties += 1
        }
      }

      // Service status evaluation
      const sDays = getDaysUntil(p.nextServiceDate, today)
      if (sDays !== null) {
        if (sDays >= 0 && sDays <= 30) {
          upcomingServices += 1
        } else if (sDays < 0) {
          overdueServices += 1
        }
      }
    }

    return {
      totalProducts: safeProducts.length,
      activeWarranties,
      expiringSoonWarranties,
      upcomingServices,
      overdueServices,
    }
  }, [products])

  if (loading) {
    return (
      <section
        className="dashboard-stats"
        aria-label="Dashboard summary"
        aria-busy="true"
      >
        <span className="sr-only">Loading dashboard summary metrics…</span>
        {[1, 2, 3, 4].map(key => (
          <div key={key} className="stat-card card stat-card--skeleton">
            <div className="stat-card__header">
              <div className="stat-skeleton-shimmer stat-skeleton-label" />
              <div className="stat-skeleton-shimmer stat-skeleton-icon" />
            </div>
            <div className="stat-skeleton-shimmer stat-skeleton-value" />
            <div className="stat-skeleton-shimmer stat-skeleton-subtext" />
          </div>
        ))}
      </section>
    )
  }

  return (
    <section className="dashboard-stats" aria-label="Dashboard summary">
      {/* 1. Total Products */}
      <div id="stat-card-total-products" className="stat-card card stat-card--primary">
        <div className="stat-card__header">
          <h3 className="stat-card__label">Total Products</h3>
          <span className="stat-card__icon-box" aria-hidden="true">📦</span>
        </div>
        <div className="stat-card__value">{stats.totalProducts}</div>
        <div className="stat-card__subtext">
          {stats.totalProducts === 1 ? '1 item registered' : `${stats.totalProducts} items registered`}
        </div>
      </div>

      {/* 2. Active Warranties */}
      <div id="stat-card-active-warranties" className="stat-card card stat-card--success">
        <div className="stat-card__header">
          <h3 className="stat-card__label">Active Warranties</h3>
          <span className="stat-card__icon-box" aria-hidden="true">🛡️</span>
        </div>
        <div className="stat-card__value">{stats.activeWarranties}</div>
        <div className="stat-card__subtext">Currently covered</div>
      </div>

      {/* 3. Warranties Expiring Soon */}
      <div id="stat-card-expiring-warranties" className="stat-card card stat-card--warning">
        <div className="stat-card__header">
          <h3 className="stat-card__label">Expiring Soon</h3>
          <span className="stat-card__icon-box" aria-hidden="true">⏳</span>
        </div>
        <div className="stat-card__value">{stats.expiringSoonWarranties}</div>
        <div className="stat-card__subtext">Within next 30 days</div>
      </div>

      {/* 4. Upcoming Services */}
      <div id="stat-card-upcoming-services" className="stat-card card stat-card--info">
        <div className="stat-card__header">
          <h3 className="stat-card__label">Upcoming Services</h3>
          <span className="stat-card__icon-box" aria-hidden="true">🔧</span>
        </div>
        <div className="stat-card__value">{stats.upcomingServices}</div>
        <div className="stat-card__subtext">
          <span>Due within 30 days</span>
          {stats.overdueServices > 0 && (
            <span
              className="stat-card__overdue-badge"
              aria-label={`${stats.overdueServices} service${stats.overdueServices !== 1 ? 's' : ''} overdue`}
            >
              {stats.overdueServices} overdue
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
