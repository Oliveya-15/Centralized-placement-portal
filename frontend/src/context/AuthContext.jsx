import { createContext, useContext, useState, useCallback } from 'react'
import { loginUser, registerUser } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cpp_user')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (authResponse) => {
    localStorage.setItem('cpp_token', authResponse.token)
    const userData = {
      userId: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
    }
    localStorage.setItem('cpp_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const login = useCallback(async (email, password) => {
    const res = await loginUser({ email, password })
    return persist(res)
  }, [])

  const register = useCallback(async (payload) => {
    const res = await registerUser(payload)
    return persist(res)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cpp_token')
    localStorage.removeItem('cpp_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
