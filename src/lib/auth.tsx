'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  needsSetup: boolean
  setupAdmin: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  needsSetup: false,
  setupAdmin: async () => ({ success: false }),
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsSetup, setNeedsSetup] = useState(false)

  // Check session on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/auth/session').then(r => r.json()).catch(() => ({ user: null })),
      fetch('/api/auth/setup').then(r => r.json()).catch(() => ({ needsSetup: false })),
    ]).then(([sessionData, setupData]) => {
      setUser(sessionData.user || null)
      setNeedsSetup(setupData.needsSetup || false)
      setLoading(false)
    })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' }
      }
      setUser(data.user)
      return { success: true }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    setUser(null)
  }, [])

  const setupAdmin = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.error || 'Setup failed' }
      }
      // Auto-login after setup
      const loginResult = await login(email, password)
      if (loginResult.success) {
        setNeedsSetup(false)
      }
      return { success: loginResult.success, error: loginResult.error }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }, [login])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, needsSetup, setupAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
