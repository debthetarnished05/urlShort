import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createShortUrl, getRedirectUrl } from '../api/urlApi'
import { useToast } from '../context/ToastContext'

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.09 6.26L21 10l-6.91 1.74L12 18l-2.09-5.26L3 11l6.91-1.74z"/>
  </svg>
)

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleShorten = async () => {
    const trimmed = url.trim()
    if (!trimmed) {
      addToast('Please enter a URL first', 'warning')
      return
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      addToast('URL must start with http:// or https://', 'warning')
      return
    }
    setLoading(true)
    try {
      const data = await createShortUrl(trimmed)
      const shortUrl = getRedirectUrl(data.id)
      setResult({ shortId: data.id, shortUrl })
      try {
        await navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        addToast('Short URL created & copied to clipboard! 🎉', 'success')
      } catch {
        addToast('Short URL created!', 'success')
      }
      setTimeout(() => navigate('/my-urls'))
    } catch (err) {
      addToast(err.message || 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      addToast('Copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast('Failed to copy', 'error')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) handleShorten()
  }

  return (
    <section className="home-page">
      <div className="home-bg-glow" />
      <div className="home-bg-glow-2" />

      <div className="home-content">
        <div className="home-badge">
          <span className="home-badge-dot" />
          Fast · Free · Powerful
        </div>

        <h1 className="home-title">
          Make every link{' '}
          <span className="gradient-text">shorter</span><br />
          Every click{' '}
          <span className="gradient-text-cyan">smarter</span>
        </h1>

        <p className="home-quote">
          Transform those unwieldy URLs into sleek, shareable links in{' '}
          <em>one click</em>. Track every visit, measure impact, and own your audience.
        </p>

        <div className="shorten-form">
          <LinkIcon />
          <input
            id="url-input"
            type="url"
            className="shorten-input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your long URL here…"
            disabled={loading || !!result}
            autoFocus
          />
          <button
            id="shorten-btn"
            className="shorten-btn"
            onClick={handleShorten}
            disabled={loading || !!result || !url.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-ring" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Shortening…
              </>
            ) : (
              <>
                <SparkleIcon />
                Shorten
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="result-box">
            <div className="result-url">
              {result.shortUrl}
              <small>Redirecting to My URLs in a moment…</small>
            </div>
            <div className="result-actions">
              <button
                className="btn btn-success btn-sm"
                onClick={handleCopy}
                id="copy-result-btn"
              >
                <CopyIcon />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate('/my-urls')}
                id="view-urls-btn"
              >
                My URLs <ArrowRightIcon />
              </button>
            </div>
          </div>
        )}

        <div className="home-stats">
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">URLs Shortened</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1s</div>
            <div className="stat-label">To Create</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Free Forever</div>
          </div>
        </div>
      </div>
    </section>
  )
}
