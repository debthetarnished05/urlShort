import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteUrl, updateUrl, getRedirectUrl } from '../api/urlApi'
import { useToast } from '../context/ToastContext'
import Modal from './Modal'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

const ClickIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 15l5.12-5.12A3 3 0 0 1 10.24 9H13a2 2 0 1 1 0 4h-2.5m4-.68l4.17 4.89A1 1 0 0 1 18 19h-4a1 1 0 0 1-.8-.4l-1.2-1.6"/>
    <path d="M8 3a5 5 0 1 0 5 5"/>
  </svg>
)

const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

export default function UrlCard({ url, index, onDeleted, onUpdated }) {
  const [editOpen, setEditOpen] = useState(false)
  const [editValue, setEditValue] = useState(url.originalURL)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const shortUrl = getRedirectUrl(url.urlId)

  const handleCardClick = (e) => {
    if (
      e.target.closest('.url-card-short-link') ||
      e.target.closest('.url-card-actions') ||
      e.target.closest('.btn')
    ) return
    navigate(`/analytics/${url.urlId}`)
  }

  const handleLinkClick = (e) => {
    e.stopPropagation()
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this short URL? This action cannot be undone.')) return
    setDeleteLoading(true)
    try {
      await deleteUrl(url.urlId)
      addToast('URL deleted successfully', 'success')
      onDeleted(url.urlId)
    } catch {
      addToast('Failed to delete URL', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleEditOpen = (e) => {
    e.stopPropagation()
    setEditValue(url.originalURL)
    setEditOpen(true)
  }

  const handleEditConfirm = async () => {
    if (!editValue.trim()) return
    setEditLoading(true)
    try {
      await updateUrl(url.urlId, editValue.trim())
      addToast('URL updated successfully', 'success')
      setEditOpen(false)
      onUpdated({ ...url, originalURL: editValue.trim() })
    } catch {
      addToast('Failed to update URL', 'error')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <>
      <div className="url-card" onClick={handleCardClick} title="Click to view analytics">
        <div className="url-card-number">#{index + 1}</div>

        <div className="url-card-body">
          <div className="url-card-short">
            <a
              className="url-card-short-link"
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              title="Open short URL in new tab"
            >
              {shortUrl}
            </a>
            <ExternalIcon />
          </div>

          <div className="url-card-original" title={url.originalURL}>
            {url.originalURL}
          </div>

          <div className="url-card-meta">
            <span className="url-card-meta-item">
              <CalIcon />
              {formatDate(url.createdAt)}
            </span>
            <span className="click-badge">
              <ClickIcon />
              {url.visitHistory?.length ?? 0} clicks
            </span>
          </div>
        </div>

        <div className="url-card-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleEditOpen}
            title="Edit original URL"
          >
            <EditIcon /> Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={deleteLoading}
            title="Delete this URL"
          >
            <TrashIcon />
            {deleteLoading ? '…' : 'Delete'}
          </button>
        </div>
      </div>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Update Destination URL"
        subtitle={`Short link: ${shortUrl}`}
        value={editValue}
        onChange={setEditValue}
        onConfirm={handleEditConfirm}
        confirmText="Save Changes"
        confirmDisabled={!editValue.trim() || editValue === url.originalURL}
        loading={editLoading}
        placeholder="https://example.com/new-url"
      />
    </>
  )
}
