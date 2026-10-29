import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from '../api/products'
import ProductCard from './ProductCard'
import Toast from './Toast'
import './ProductList.css'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [toast, setToast] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6


  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Delete handler
  async function handleDelete(id) {
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p._id !== id))
      setToast({ type: 'success', message: 'Product deleted.' })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    }
  }


  // Warranty and service reminders
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function getDaysUntil(dateValue) {
    if (!dateValue) return null

    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return null

    date.setHours(0, 0, 0, 0)
    return Math.round((date - today) / 86400000)
  }

  const reminders = products.flatMap(product => {
    const items = []


    const warrantyDays = getDaysUntil(product.warrantyExpiry)

    if (
      warrantyDays !== null &&
      warrantyDays >= 0 &&
      warrantyDays <= 7 &&
      (warrantyDays === 0 || warrantyDays % 2 === 1)
    ) {
      items.push({
        id: `${product._id}-warranty`,
        productId: product._id,
        productName: product.name,
        type: warrantyDays <= 2 ? 'danger' : 'warning',
        title: warrantyDays === 0
          ? 'Warranty expires today'
          : 'Warranty expiring soon',
        detail: warrantyDays === 0
          ? 'Expires today'
          : `Expires in ${warrantyDays} day(s)`,
      })
    }



    const serviceDays = getDaysUntil(product.nextServiceDate)

    if (
      serviceDays !== null &&
      serviceDays >= 0 &&
      serviceDays <= 7 &&
      (serviceDays === 0 || serviceDays % 2 === 1)
    ) {
      items.push({
        id: `${product._id}-service`,
        productId: product._id,
        productName: product.name,
        type: serviceDays <= 2 ? 'danger' : 'warning',
        title: serviceDays === 0
          ? 'Service due today'
          : 'Service due soon',
        detail: serviceDays === 0
          ? 'Due today'
          : `Due in ${serviceDays} day(s)`,
      })
    }


    return items
  })

  // Derived: unique categories from data
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

  // Filtered list
  const filtered = products.filter(p => {
    const matchSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || p.category === filterCat
    return matchSearch && matchCat
  })


  const totalPages = Math.ceil(filtered.length / productsPerPage)

  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filtered.slice(
    startIndex,
    startIndex + productsPerPage
  )


  // ── Render ────────────────────────────────────────────────
  return (
    <div>
      {/* Warranty and service reminders */}
      {!loading && !error && reminders.length > 0 && (
        <section className="reminder-panel" aria-labelledby="reminder-heading">
          <div className="reminder-panel__header">
            <h2 id="reminder-heading">🔔 Reminders</h2>
            <span className="badge badge-muted">
              {reminders.length} alert{reminders.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="reminder-list">
            {reminders.map(reminder => (
              <Link
                key={reminder.id}
                to={`/products/${reminder.productId}`}
                className={`reminder-item reminder-item--${reminder.type}`}
              >
                <span className="reminder-item__icon" aria-hidden="true">
                  {reminder.type === 'danger' ? '⚠️' : '🔔'}
                </span>
                <span className="reminder-item__content">
                  <strong>{reminder.title}</strong>
                  <span>{reminder.productName} · {reminder.detail}</span>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="product-list__filters">
        <input
          id="product-search"
          type="search"
          className="form-input product-list__search"
          placeholder="Search by name or brand…"
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          aria-label="Search products"
        />
        <div className="product-list__cats" role="group" aria-label="Filter by category">
          {categories.map(cat => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              className={`btn btn-sm ${filterCat === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setFilterCat(cat)
                setCurrentPage(1)
              }}
              aria-pressed={filterCat === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="loading-center">
          <div className="spinner" role="status" aria-label="Loading products" />
          <p>Loading your products…</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box">
          <div className="state-icon">⚠️</div>
          <h3>Failed to load products</h3>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchProducts}>Try again</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="state-box">
          <div className="state-icon">{products.length === 0 ? '🗃️' : '🔍'}</div>
          <h3>{products.length === 0 ? 'No products yet' : 'No results found'}</h3>
          <p>
            {products.length === 0
              ? 'Add your first product to start tracking warranties and repairs.'
              : 'Try a different search term or category.'}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="product-list__count">
            Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''}
          </p>
          <div className="product-grid">
            {paginatedProducts.map(product => (
              <ProductCard key={product._id} product={product} onDelete={handleDelete} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Product pages">
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(page => page - 1)}
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'
                    }`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(page => page + 1)}
              >
                Next →
              </button>
            </nav>
          )}

        </>
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
