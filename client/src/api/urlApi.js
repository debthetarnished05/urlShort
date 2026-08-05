const BASE_URL = 'http://localhost:5000'

function authHeader() {
  const token = localStorage.getItem('urlshort_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function createShortUrl(url) {
  const res = await fetch(`${BASE_URL}/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to shorten URL')
  }
  return res.json()
}

export async function getAllUrls() {
  const res = await fetch(`${BASE_URL}/url/all`, {
    headers: { ...authHeader() },
  })
  if (!res.ok) throw new Error('Failed to fetch URLs')
  return res.json()
}

export async function getAnalytics(shortId) {
  const res = await fetch(`${BASE_URL}/url/analytics/${shortId}`)
  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}

export async function updateUrl(shortId, newUrl) {
  const res = await fetch(`${BASE_URL}/url/${shortId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ url: newUrl }),
  })
  if (!res.ok) throw new Error('Failed to update URL')
  return res.json()
}

export async function deleteUrl(shortId) {
  const res = await fetch(`${BASE_URL}/url/${shortId}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  })
  if (!res.ok) throw new Error('Failed to delete URL')
  return res.json()
}

export function getRedirectUrl(shortId) {
  return `${BASE_URL}/${shortId}`
}
