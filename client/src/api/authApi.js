

export async function register(name, email, password) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Registration failed')
  return data
}

export async function login(email, password) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  return data
}

export async function getMe(token) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Token invalid')
  return data
}
