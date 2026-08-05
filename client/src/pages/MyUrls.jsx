import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUrls } from '../api/urlApi'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import UrlCard from '../components/UrlCard'
import LoadingSpinner from '../components/LoadingSpinner'

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
)

export default function MyUrls() {
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const navigate = useNavigate()

  const fetchUrls = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else if (urls.length === 0) setLoading(true)
    try {
      const data = await getAllUrls()
      setUrls(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchUrls()
  }, [])

  useAutoRefresh(fetchUrls)

  const handleDeleted = (urlId) => {
    setUrls(prev => prev.filter(u => u.urlId !== urlId))
  }

  const handleUpdated = (updated) => {
    setUrls(prev => prev.map(u => u.urlId === updated.urlId ? updated : u))
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return urls
    const q = search.toLowerCase()
    return urls.filter(u =>
      u.urlId.toLowerCase().includes(q) ||
      u.originalURL.toLowerCase().includes(q)
    )
  }, [urls, search])

  const totalClicks = urls.reduce((acc, u) => acc + (u.visitHistory?.length || 0), 0)

  return (
    <div className="myurls-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">
              My <span>URLs</span>
            </h1>
            <p className="page-subtitle">
              {loading ? 'Loading your links…' : `${urls.length} link${urls.length !== 1 ? 's' : ''} · ${totalClicks} total clicks`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => fetchUrls(true)}
              disabled={refreshing}
              id="refresh-btn"
            >
              <RefreshIcon />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/')}
              id="new-url-btn"
            >
              <PlusIcon />
              New URL
            </button>
          </div>
        </div>

        {!loading && urls.length > 0 && (
          <div className="search-bar-wrapper">
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none'
              }}>
                <SearchIcon />
              </span>
              <input
                id="search-input"
                type="text"
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by short ID or original URL…"
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your URLs…" />
      ) : urls.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔗</div>
          <h3>No URLs yet</h3>
          <p>Go to the Home page to shorten your first URL!</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 24 }}
            onClick={() => navigate('/')}
          >
            <PlusIcon /> Shorten a URL
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No results found</h3>
          <p>No URLs match "{search}"</p>
        </div>
      ) : (
        <div className="urls-grid">
          {filtered.map((url, i) => (
            <UrlCard
              key={url.urlId}
              url={url}
              index={i}
              onDeleted={handleDeleted}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  )
}
