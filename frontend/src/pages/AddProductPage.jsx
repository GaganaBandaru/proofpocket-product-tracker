import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createProduct } from '../api/products'
import ProductForm from '../components/ProductForm'
import Toast from '../components/Toast'
import './FormPage.css'

export default function AddProductPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)

  async function handleSubmit(data) {
    try {
      setIsLoading(true)
      const created = await createProduct(data)
      navigate(`/products/${created._id}`, { state: { flash: 'Product added successfully!' } })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
      setIsLoading(false)
    }
  }

  return (
    <main className="page">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Products</Link>
          <span aria-hidden="true"> / </span>
          <span>Add Product</span>
        </nav>

        <header className="page-header">
          <h1>Add Product</h1>
          <Link to="/" className="btn btn-ghost">← Back</Link>
        </header>

        <div className="form-page__card card fade-in">
          <ProductForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Add Product"
          />
        </div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </main>
  )
}
