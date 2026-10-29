import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getProduct, updateProduct } from '../api/products'
import ProductForm from '../components/ProductForm'
import Toast from '../components/Toast'
import './FormPage.css'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)
  const [toast, setToast]       = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProduct(id)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleSubmit(data) {
    try {
      setSaving(true)
      await updateProduct(id, data)
      navigate(`/products/${id}`, { state: { flash: 'Product updated successfully!' } })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
      setSaving(false)
    }
  }

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
            <h2>Failed to load product</h2>
            <p>{error}</p>
            <Link to="/" className="btn btn-secondary">← Back to Products</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Products</Link>
          <span aria-hidden="true"> / </span>
          <Link to={`/products/${id}`}>{product?.name}</Link>
          <span aria-hidden="true"> / </span>
          <span>Edit</span>
        </nav>

        <header className="page-header">
          <h1>Edit Product</h1>
          <Link to={`/products/${id}`} className="btn btn-ghost">← Back</Link>
        </header>

        <div className="form-page__card card fade-in">
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            isLoading={saving}
            submitLabel="Save Changes"
          />
        </div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </main>
  )
}
