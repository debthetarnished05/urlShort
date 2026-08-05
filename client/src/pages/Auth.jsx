import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { register, login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

export default function Auth() {
  const { isAuthenticated, login: authLogin } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [mode, setMode]         = useState('signin')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})

  if (isAuthenticated) return <Navigate to="/" replace />

  const validate = () => {
    const e = {}
    if (mode === 'signup' && !name.trim()) e.name = 'Name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'At least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      let data
      if (mode === 'signup') {
        data = await register(name.trim(), email.trim(), password)
        addToast(`Welcome, ${data.user.name}! Account created 🎉`, 'success')
      } else {
        data = await login(email.trim(), password)
        addToast(`Welcome back, ${data.user.name}!`, 'success')
      }
      authLogin(data.token, data.user)
      navigate('/')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(m => m === 'signin' ? 'signup' : 'signin')
    setErrors({})
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <span className="auth-brand-logo">url<span>Short</span></span>
          </div>
          <h2 className="auth-left-title">
            Make every link<br />
            <span className="gradient-text">unforgettable</span>
          </h2>
          <p className="auth-left-sub">
            Shorten, track and manage all your links from one beautiful dashboard.
          </p>
          <div className="auth-left-features">
            {['Instant URL shortening', 'Click analytics & history', 'Secure & private links', 'Free forever'].map(f => (
              <div key={f} className="auth-feature-item">
                <span className="auth-feature-check">✦</span>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <h1 className="auth-form-title">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="auth-form-subtitle">
              {mode === 'signin'
                ? 'Sign in to access your short links'
                : 'Start shortening URLs in seconds'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {mode === 'signup' && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="name">Full Name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><UserIcon /></span>
                  <input
                    id="name"
                    type="text"
                    className={`auth-input${errors.name ? ' auth-input-error' : ''}`}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>
                {errors.name && <span className="auth-error">{errors.name}</span>}
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><MailIcon /></span>
                <input
                  id="email"
                  type="email"
                  className={`auth-input${errors.email ? ' auth-input-error' : ''}`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><LockIcon /></span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className={`auth-input${errors.password ? ' auth-input-error' : ''}`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPass(s => !s)}
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-ring" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button className="auth-switch-btn" onClick={switchMode} type="button">
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
