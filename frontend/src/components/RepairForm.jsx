import { useState } from 'react'
import './RepairForm.css'

const EMPTY = { date: '', issue: '', workPerformed: '', cost: '' }

export default function RepairForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.issue.trim()) errs.issue = 'Describe the issue.'
    if (form.cost !== '' && Number(form.cost) < 0) errs.cost = 'Cost cannot be negative.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const payload = { issue: form.issue.trim() }
    if (form.date)            payload.date          = form.date
    if (form.workPerformed)   payload.workPerformed = form.workPerformed.trim()
    if (form.cost !== '')     payload.cost          = Number(form.cost)

    await onSubmit(payload)
    setForm(EMPTY)
  }

  return (
    <form
      id="repair-form"
      className="repair-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Add repair record"
    >
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="repair-issue" className="form-label">
            Issue <span aria-hidden="true" style={{ color: 'var(--clr-danger)' }}>*</span>
          </label>
          <input
            id="repair-issue"
            name="issue"
            type="text"
            className={`form-input ${errors.issue ? 'form-input--error' : ''}`}
            placeholder="e.g. Screen cracked"
            value={form.issue}
            onChange={handleChange}
          />
          {errors.issue && <p className="form-error">{errors.issue}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="repair-date" className="form-label">Repair Date</label>
          <input
            id="repair-date"
            name="date"
            type="date"
            className="form-input"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group repair-form__work">
          <label htmlFor="repair-work" className="form-label">Work Performed</label>
          <input
            id="repair-work"
            name="workPerformed"
            type="text"
            className="form-input"
            placeholder="e.g. Screen replacement"
            value={form.workPerformed}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="repair-cost" className="form-label">Cost (₹)</label>
          <input
            id="repair-cost"
            name="cost"
            type="number"
            min="0"
            step="0.01"
            className={`form-input ${errors.cost ? 'form-input--error' : ''}`}
            placeholder="e.g. 3500"
            value={form.cost}
            onChange={handleChange}
          />
          {errors.cost && <p className="form-error">{errors.cost}</p>}
        </div>
      </div>

      <button
        id="repair-form-submit"
        type="submit"
        className="btn btn-secondary btn-sm repair-form__submit"
        disabled={isLoading}
      >
        {isLoading ? 'Adding…' : '+ Add Repair'}
      </button>
    </form>
  )
}
