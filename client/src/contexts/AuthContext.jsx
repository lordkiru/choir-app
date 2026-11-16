import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('choir_token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        // Check expiry
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded)
        } else {
          localStorage.removeItem('choir_token')
        }
      } catch {
        localStorage.removeItem('choir_token')
      }
    }
    setLoading(false)
  }, [])

  function loginUser(token) {
    localStorage.setItem('choir_token', token)
    const decoded = jwtDecode(token)
    setUser(decoded)
  }

  function logoutUser() {
    localStorage.removeItem('choir_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
