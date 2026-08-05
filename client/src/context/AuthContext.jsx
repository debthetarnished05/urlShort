import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe } from '../api/authApi'

const AuthContext = createContext(null)

const TOKEN_KEY = 'urlshort_token'

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function validate() {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (!stored) { setLoading(false); return }
      try {
        const { user } = await getMe(stored)
        setUser(user)
        setToken(stored)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    validate()
  }, [])

  const login = useCallback((token, user) => {
    localStorage.setItem(TOKEN_KEY, token)
    setToken(token)
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
