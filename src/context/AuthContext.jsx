import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      authAPI.profile()
        .then((res) => setUser(res.data.data.admin))
        .catch(() => localStorage.removeItem('auth_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password, remember = false) => {
    const res = await authAPI.login({ email, password, remember })
    localStorage.setItem('auth_token', res.data.data.token)
    setUser(res.data.data.admin)
    return res.data
  }

  const logout = async () => {
    try { await authAPI.logout() } catch {}
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
