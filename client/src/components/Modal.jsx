import { useEffect, useRef } from 'react'

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  value,
  onChange,
  onConfirm,
  confirmText = 'Save',
  confirmDisabled = false,
  loading = false,
  placeholder = '',
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter' && !confirmDisabled && !loading) onConfirm()
  }

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        <input
          ref={inputRef}
          type="url"
          className="modal-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={confirmDisabled || loading}
          >
            {loading ? (
              <>
                <span className="spinner-ring" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Saving…
              </>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
