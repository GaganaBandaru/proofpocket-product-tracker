import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { getProduct, deleteProduct, addRepair, deleteRepair } from '../api/products'
import RepairForm from '../components/RepairForm'
import Toast from '../components/Toast'
import './ProductDetailPage.css'

// ── Helpers ───────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatCurrency(n) {
  if (n == null || n === 0) return '—'
  return `₹${Number(n).toLocaleString('en-IN')}`
}

function warrantyStatus(expiryDate) {
  if (!expiryDate) return null
  const diffDays = Math.ceil((new Date(expiryDate) - new Date()) / 86400000)
  if (diffDays < 0) return { label: 'Expired', badge: 'badge-danger' }
  if (diffDays <= 30) return { label: `Expires in ${diffDays}d`, badge: 'badge-warning' }
  if (diffDays <= 90) return { label: `Expires in ${diffDays}d`, badge: 'badge-info' }
  return { label: 'Warranty Active', badge: 'badge-success' }
}

// ── Component ─────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingRepair, setAddingRepair] = useState(false)
  const [toast, setToast] = useState(
    location.state?.flash ? { type: 'success', message: location.state.flash } : null
  )

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProduct(id)
      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchProduct() }, [fetchProduct])

  // Delete the whole product
  async function handleDeleteProduct() {
    if (!window.confirm(`Delete "${product.name}" and all its repair history? This cannot be undone.`)) return
    try {
      await deleteProduct(id)
      navigate('/', { state: { flash: 'Product deleted.' } })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    }
  }

  // Add a repair
  async function handleAddRepair(repairData) {
    try {
      setAddingRepair(true)
      const updated = await addRepair(id, repairData)
      setProduct(updated)
      setToast({ type: 'success', message: 'Repair record added.' })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    } finally {
      setAddingRepair(false)
    }
  }

  // Remove a repair
  async function handleDeleteRepair(repairId) {
    if (!window.confirm('Remove this repair record?')) return
    try {
      const updated = await deleteRepair(id, repairId)
      setProduct(updated)
      setToast({ type: 'success', message: 'Repair record removed.' })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    }
  }

  // ── States ─────────────────────────────────────────────
  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="loading-center">
            <div className="spinner" />
            <p>Loading product…</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <div className="container">
          <div className="state-box">
            <div className="state-icon">⚠️</div>
            <h2>Product not found</h2>
            <p>{error}</p>
            <Link to="/" className="btn btn-secondary">← Back to Products</Link>
          </div>
        </div>
      </main>
    )
  }

  const status = warrantyStatus(product.warrantyExpiry)
  const totalRepairCost = product.repairs?.reduce((sum, r) => sum + (r.cost || 0), 0) ?? 0
  const totalOwnershipCost = Number(product.purchasePrice || 0) + totalRepairCost
  // ── Render ─────────────────────────────────────────────
  return (
    <main className="page">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Products</Link>
          <span aria-hidden="true"> / </span>
          <span>{product.name}</span>
        </nav>

        {/* Header */}
        <header className="detail-header fade-in">
          <div className="detail-header__left">
            <h1 className="detail-header__name">{product.name}</h1>
            <div className="detail-header__tags">
              {product.brand && (
                <span className="badge badge-muted">{product.brand}</span>
              )}
              <span className="badge badge-muted">{product.category}</span>
              {status && (
                <span className={`badge ${status.badge}`}>
                  <span aria-hidden="true">●</span> {status.label}
                </span>
              )}
            </div>
          </div>
          <div className="detail-header__actions">
            <Link
              id="edit-product-btn"
              to={`/products/${id}/edit`}
              className="btn btn-secondary"
            >
              ✏️ Edit
            </Link>
            <button
              id="delete-product-btn"
              className="btn btn-danger"
              onClick={handleDeleteProduct}
            >
              🗑 Delete
            </button>
          </div>
        </header>

        {/* Info grid */}
        <div className="detail-grid fade-in">
          {/* Details card */}
          <section className="detail-card card" aria-label="Product details">
            <h2 className="detail-card__title">Product Details</h2>
            <dl className="detail-dl">
              <div className="detail-dl__row">
                <dt>Purchase Date</dt>
                <dd>{formatDate(product.purchaseDate)}</dd>
              </div>
              <div className="detail-dl__row">
                <dt>Purchase Price</dt>
                <dd>{formatCurrency(product.purchasePrice)}</dd>
              </div>
              <div className="detail-dl__row">
                <dt>Warranty Expiry</dt>
                <dd>{formatDate(product.warrantyExpiry)}</dd>
              </div>
              <div className="detail-dl__row">
                <dt>Next Service</dt>
                <dd>{formatDate(product.nextServiceDate)}</dd>
              </div>
              <div className="detail-dl__row">
                <dt>Added On</dt>
                <dd>{formatDate(product.createdAt)}</dd>
              </div>
            </dl>

            {product.notes && (
              <>
                <hr className="divider" />
                <div className="detail-notes">
                  <h3>Notes</h3>
                  <p>{product.notes}</p>
                </div>
              </>
            )}
          </section>

          {/* Summary card */}
          <section className="detail-summary" aria-label="Summary stats">
            <div className="summary-stat card">
              <span className="summary-stat__icon">🔧</span>
              <span className="summary-stat__value">{product.repairs?.length ?? 0}</span>
              <span className="summary-stat__label">Repairs</span>
            </div>
            <div className="summary-stat card">
              <span className="summary-stat__icon">💸</span>
              <span className="summary-stat__value">
                {totalRepairCost > 0 ? `₹${totalRepairCost.toLocaleString('en-IN')}` : '₹0'}
              </span>
              <span className="summary-stat__label">Repair Cost</span>
            </div>
            <div className="summary-stat card">
              <span className="summary-stat__icon">💰</span>
              <span className="summary-stat__value">
                {`₹${totalOwnershipCost.toLocaleString('en-IN')}`}
              </span>
              <span className="summary-stat__label">Total Ownership Cost</span>
            </div>
          </section>
        </div>

        {/* Repair History */}
        <section className="repairs-section fade-in" aria-label="Repair history">
          <h2 className="repairs-section__title">
            Repair History
            {product.repairs?.length > 0 && (
              <span className="badge badge-muted" style={{ marginLeft: '10px', verticalAlign: 'middle' }}>
                {product.repairs.length}
              </span>
            )}
          </h2>

          {/* Add repair form */}
          <div className="repairs-section__form">
            <h3>Log a Repair</h3>
            <RepairForm onSubmit={handleAddRepair} isLoading={addingRepair} />
          </div>

          {/* Repair list */}
          {product.repairs?.length === 0 ? (
            <p className="repairs-empty">No repair records yet. Log the first one above.</p>
          ) : (
            <ul className="repair-list" role="list">
              {[...product.repairs].reverse().map(repair => (
                <li key={repair._id} className="repair-item card">
                  <div className="repair-item__header">
                    <div>
                      <p className="repair-item__issue">{repair.issue}</p>
                      {repair.date && (
                        <p className="repair-item__date">{formatDate(repair.date)}</p>
                      )}
                    </div>
                    <div className="repair-item__right">
                      {repair.cost > 0 && (
                        <span className="badge badge-warning">
                          ₹{Number(repair.cost).toLocaleString('en-IN')}
                        </span>
                      )}
                      <button
                        id={`delete-repair-${repair._id}`}
                        className="btn btn-icon btn-danger btn-sm"
                        onClick={() => handleDeleteRepair(repair._id)}
                        aria-label="Delete repair record"
                        title="Remove repair"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {repair.workPerformed && (
                    <p className="repair-item__work">
                      <strong>Work:</strong> {repair.workPerformed}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </main>
  )
}
