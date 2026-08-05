import { useEffect, useRef } from 'react'

export function useAutoRefresh(fetchFn) {
  const fetchRef = useRef(fetchFn)

  useEffect(() => {
    fetchRef.current = fetchFn
  }, [fetchFn])

  useEffect(() => {
    const handleFocus = () => fetchRef.current()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])
}
