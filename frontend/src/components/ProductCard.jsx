import { Link } from 'react-router-dom'
import './ProductCard.css'

// ── Helpers ───────────────────────────────────────────────
function warrantyStatus(expiryDate) {
  if (!expiryDate) return null
  const now = new Date()
  const exp = new Date(expiryDate)
  const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))

  if (diffDays < 0)  return { label: 'Expired',      badge: 'badge-danger' }
  if (diffDays <= 30) return { label: `${diffDays}d left`, badge: 'badge-warning' }
  if (diffDays <= 90) return { label: `${diffDays}d left`, badge: 'badge-info' }
  return               { label: 'Active',         badge: 'badge-success' }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

const CATEGORY_ICONS = {
  Electronics:  '💻',
  Appliances:   '🏠',
  Furniture:    '🪑',
  Vehicle:      '🚗',
  Clothing:     '👕',
  Tools:        '🔧',
  Garden:       '🌿',
  Sports:       '⚽',
  Other:        '📦',
}

// ── Component ─────────────────────────────────────────────
export default function ProductCard({ product, onDelete }) {
  const status = warrantyStatus(product.warrantyExpiry)
  const icon = CATEGORY_ICONS[product.category] ?? '📦'

  function handleDelete(e) {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      onDelete(product._id)
    }
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className="product-card card fade-in"
      aria-label={`View details for ${product.name}`}
    >
      {/* Header */}
      <div className="product-card__header">
        <span className="product-card__icon" aria-hidden="true">{icon}</span>
        <div className="product-card__meta">
          {status && (
            <span className={`badge ${status.badge}`}>
              <span aria-hidden="true">●</span>
              {status.label}
            </span>
          )}
        </div>
        <button
          id={`delete-product-${product._id}`}
          className="btn btn-icon btn-danger product-card__delete"
          onClick={handleDelete}
          aria-label={`Delete ${product.name}`}
          title="Delete product"
        >
          🗑
        </button>
      </div>

      {/* Body */}
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        {product.brand && (
          <p className="product-card__brand">{product.brand}</p>
        )}
        <span className="badge badge-muted product-card__category">
          {product.category}
        </span>
      </div>

      {/* Footer */}
      <div className="product-card__footer">
        <div className="product-card__stat">
          <span className="product-card__stat-label">Purchased</span>
          <span className="product-card__stat-value">{formatDate(product.purchaseDate)}</span>
        </div>
        {product.purchasePrice > 0 && (
          <div className="product-card__stat">
            <span className="product-card__stat-label">Price</span>
            <span className="product-card__stat-value">₹{product.purchasePrice.toLocaleString('en-IN')}</span>
          </div>
        )}
        {product.repairs?.length > 0 && (
          <div className="product-card__repairs-badge">
            🔧 {product.repairs.length} repair{product.repairs.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </Link>
  )
}
