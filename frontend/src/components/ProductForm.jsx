import { useState, useEffect } from 'react'
import './ProductForm.css'

const CATEGORIES = [
  'Electronics', 'Appliances', 'Furniture', 'Vehicle',
  'Clothing', 'Tools', 'Garden', 'Sports', 'Other',
]

const EMPTY_FORM = {
  name: '',
  brand: '',
  category: 'Electronics',
  purchaseDate: '',
  purchasePrice: '',
  warrantyExpiry: '',
  nextServiceDate: '',
  notes: '',
}

// Convert ISO date → YYYY-MM-DD for <input type="date">
function toDateInput(iso) {
  if (!iso) return ''
  return new Date(iso).toISOString().split('T')[0]
}

export default function ProductForm({ initialData, onSubmit, isLoading, submitLabel = 'Save Product' }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Pre-fill when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name:            initialData.name            ?? '',
        brand:           initialData.brand           ?? '',
        category:        initialData.category        ?? 'Electronics',
        purchaseDate:    toDateInput(initialData.purchaseDate),
        purchasePrice:   initialData.purchasePrice   ?? '',
        warrantyExpiry:  toDateInput(initialData.warrantyExpiry),
        nextServiceDate: toDateInput(initialData.nextServiceDate),
        notes:           initialData.notes           ?? '',
      })
    }
  }, [initialData])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())     errs.name = 'Product name is required.'
    if (!form.category.trim()) errs.category = 'Category is required.'
    if (form.purchasePrice !== '' && Number(form.purchasePrice) < 0) {
      errs.purchasePrice = 'Price cannot be negative.'
    }
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    // Build clean payload — only include non-empty values
    const payload = {
      name:     form.name.trim(),
      brand:    form.brand.trim(),
      category: form.category,
      notes:    form.notes.trim(),
    }
    if (form.purchaseDate)    payload.purchaseDate    = form.purchaseDate
    if (form.purchasePrice !== '') payload.purchasePrice = Number(form.purchasePrice)
    if (form.warrantyExpiry)  payload.warrantyExpiry  = form.warrantyExpiry
    if (form.nextServiceDate) payload.nextServiceDate = form.nextServiceDate

    onSubmit(payload)
  }

  return (
    <form
      id="product-form"
      className="product-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Product form"
    >
      {/* Basic info */}
      <section className="product-form__section">
        <h3 className="product-form__section-title">Basic Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="field-name" className="form-label">
              Product Name <span aria-hidden="true" className="required">*</span>
            </label>
            <input
              id="field-name"
              name="name"
              type="text"
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              placeholder="e.g. Samsung Galaxy S24"
              value={form.name}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby={errors.name ? 'error-name' : undefined}
            />
            {errors.name && <p id="error-name" className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="field-brand" className="form-label">Brand</label>
            <input
              id="field-brand"
              name="brand"
              type="text"
              className="form-input"
              placeholder="e.g. Samsung"
              value={form.brand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="field-category" className="form-label">
              Category <span aria-hidden="true" className="required">*</span>
            </label>
            <select
              id="field-category"
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
              required
              aria-required="true"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="field-purchasePrice" className="form-label">Purchase Price (₹)</label>
            <input
              id="field-purchasePrice"
              name="purchasePrice"
              type="number"
              min="0"
              step="0.01"
              className={`form-input ${errors.purchasePrice ? 'form-input--error' : ''}`}
              placeholder="e.g. 79999"
              value={form.purchasePrice}
              onChange={handleChange}
            />
            {errors.purchasePrice && <p className="form-error">{errors.purchasePrice}</p>}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Dates */}
      <section className="product-form__section">
        <h3 className="product-form__section-title">Dates & Warranty</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="field-purchaseDate" className="form-label">Purchase Date</label>
            <input
              id="field-purchaseDate"
              name="purchaseDate"
              type="date"
              className="form-input"
              value={form.purchaseDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="field-warrantyExpiry" className="form-label">Warranty Expiry</label>
            <input
              id="field-warrantyExpiry"
              name="warrantyExpiry"
              type="date"
              className="form-input"
              value={form.warrantyExpiry}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="field-nextServiceDate" className="form-label">Next Service Date</label>
            <input
              id="field-nextServiceDate"
              name="nextServiceDate"
              type="date"
              className="form-input"
              value={form.nextServiceDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Notes */}
      <section className="product-form__section">
        <h3 className="product-form__section-title">Notes</h3>
        <div className="form-group">
          <label htmlFor="field-notes" className="form-label">Additional Notes</label>
          <textarea
            id="field-notes"
            name="notes"
            className="form-textarea"
            placeholder="Serial number, store, model number…"
            value={form.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </section>

      {/* Submit */}
      <div className="product-form__actions">
        <button
          id="product-form-submit"
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              Saving…
            </>
          ) : submitLabel}
        </button>
      </div>
    </form>
  )
}
