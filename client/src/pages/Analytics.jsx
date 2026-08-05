import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnalytics, getAllUrls, deleteUrl, updateUrl, getRedirectUrl } from '../api/urlApi'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

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

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getRelativeTime(dateStr) {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const secs = Math.floor(diff / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function Analytics() {
  const { shortId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [analytics, setAnalytics] = useState(null)
  const [urlData, setUrlData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const shortUrl = getRedirectUrl(shortId)

  const loadAnalytics = useCallback(async () => {
    try {
      const [analyticsData, allUrls] = await Promise.all([
        getAnalytics(shortId),
        getAllUrls(),
      ])
      setAnalytics(analyticsData)
      const found = allUrls.find(u => u.urlId === shortId)
      if (found) {
        setUrlData(found)
        setEditValue(v => v || found.originalURL)
      }
    } catch (err) {}
  }, [shortId])

  useEffect(() => {
    setLoading(true)
    loadAnalytics().finally(() => setLoading(false))
  }, [loadAnalytics])

  useAutoRefresh(loadAnalytics)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      addToast('Short URL copied!', 'success')
    } catch {
      addToast('Failed to copy', 'error')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this short URL permanently?')) return
    setDeleteLoading(true)
    try {
      await deleteUrl(shortId)
      addToast('URL deleted', 'success')
      navigate('/my-urls')
    } catch {
      addToast('Failed to delete', 'error')
      setDeleteLoading(false)
    }
  }

  const handleEditConfirm = async () => {
    if (!editValue.trim()) return
    setEditLoading(true)
    try {
      await updateUrl(shortId, editValue.trim())
      setUrlData(prev => ({ ...prev, originalURL: editValue.trim() }))
      addToast('URL updated!', 'success')
      setEditOpen(false)
    } catch {
      addToast('Failed to update URL', 'error')
    } finally {
      setEditLoading(false)
    }
  }

  if (loading) return <div className="analytics-page"><LoadingSpinner message="Loading analytics…" /></div>

  const createdDate = urlData ? formatDate(urlData.createdAt) : '—'
  const lastClickDate = analytics?.analytics?.length
    ? formatDateTime(analytics.analytics[analytics.analytics.length - 1].timestamp)
    : null

  return (
    <div className="analytics-page">
      <button className="analytics-back" onClick={() => navigate('/my-urls')}>
        <BackIcon />
        Back to My URLs
      </button>

      <div className="analytics-header">
        <div className="analytics-short-url">
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            {shortUrl}
          </a>
        </div>
        {urlData && (
          <div className="analytics-original-url">
            ↳ {urlData.originalURL}
          </div>
        )}
      </div>

      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <div className="analytics-stat-label">Total Clicks</div>
          <div className="analytics-stat-value purple">
            {analytics?.totalClicks ?? 0}
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-label">Created On</div>
          <div className="analytics-stat-value cyan" style={{ fontSize: '1.2rem', paddingTop: 8 }}>
            {createdDate}
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-label">Last Clicked</div>
          <div className="analytics-stat-value green" style={{ fontSize: lastClickDate ? '0.95rem' : '2rem', paddingTop: lastClickDate ? 10 : 0 }}>
            {lastClickDate ?? '—'}
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-label">Short ID</div>
          <div className="analytics-stat-value" style={{ fontSize: '1.4rem', color: 'var(--accent-pink)' }}>
            {shortId}
          </div>
        </div>
      </div>

      <div className="analytics-section">
        <div className="analytics-section-header">
          <span className="analytics-section-title">
            <ClockIcon style={{ marginRight: 6 }} />
            Click History
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowHistory(h => !h)}
            id="toggle-history-btn"
          >
            {showHistory ? 'Hide' : `Show ${analytics?.analytics?.length ?? 0} timestamps`}
          </button>
        </div>

        {showHistory && (
          <div className="analytics-section-body">
            {!analytics?.analytics?.length ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No clicks recorded yet. Share your short link!
              </p>
            ) : (
              <div className="click-history-list">
                {[...analytics.analytics].reverse().map((entry, i) => (
                  <div key={i} className="click-history-item" style={{ animationDelay: `${i * 0.03}s` }}>
                    <div className="click-history-item-index">{analytics.analytics.length - i}</div>
                    <div className="click-history-item-time">
                      {formatDateTime(entry.timestamp)}
                    </div>
                    <div className="click-history-item-relative">
                      {getRelativeTime(entry.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="analytics-actions">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          id="open-link-btn"
        >
          <ExternalIcon />
          Open Link
        </a>
        <button className="btn btn-ghost" onClick={handleCopy} id="copy-link-btn">
          <CopyIcon />
          Copy Short URL
        </button>
        <button className="btn btn-secondary" onClick={() => setEditOpen(true)} id="edit-link-btn">
          <EditIcon />
          Update URL
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={deleteLoading}
          id="delete-link-btn"
        >
          <TrashIcon />
          {deleteLoading ? 'Deleting…' : 'Delete'}
        </button>
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
        confirmDisabled={!editValue.trim() || (urlData && editValue.trim() === urlData.originalURL)}
        loading={editLoading}
        placeholder="https://example.com/new-destination"
      />
    </div>
  )
}
