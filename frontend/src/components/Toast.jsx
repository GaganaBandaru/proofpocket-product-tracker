import { useEffect } from 'react'

export default function Toast({ type = 'success', message, onClose, duration = 3500 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`toast toast-${type}`}
    >
      <span aria-hidden="true">{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  )
}
