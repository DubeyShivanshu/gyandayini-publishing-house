import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('gyd_token')

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => { localStorage.removeItem('gyd_token'); delete axios.defaults.headers.common['Authorization'] })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (userData, tokenStr) => {
    localStorage.setItem('gyd_token', tokenStr)
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenStr}`
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('gyd_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isOwner: user?.role === 'owner' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
