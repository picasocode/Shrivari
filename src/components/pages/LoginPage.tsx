'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, User, Shield, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'

interface LoginPageProps {
  onClose: () => void
}

export default function LoginPage({ onClose }: LoginPageProps) {
  const { login, needsSetup, setupAdmin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Derive mode from needsSetup — no flash, always correct
  const mode: 'login' | 'setup' = needsSetup ? 'setup' : 'login'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter email and password.')
      return
    }
    setSubmitting(true)
    const result = await login(email, password)
    setSubmitting(false)
    if (!result.success) {
      setError(result.error || 'Login failed')
    }
    // On success, the auth context will update and AdminPanel will render
  }

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) {
      setError('All fields are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setSubmitting(true)
    const result = await setupAdmin(name, email, password)
    setSubmitting(false)
    if (!result.success) {
      setError(result.error || 'Setup failed')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white rounded-xl shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2D2D2D] to-[#1a1a1a] p-6 text-center">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7 text-[#E8751A]" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">
              {mode === 'setup' ? 'Admin Setup' : 'Admin Login'}
            </h1>
            <p className="text-white/60 text-sm">
              {mode === 'setup'
                ? 'Create your admin account to get started'
                : 'Sign in to access the admin panel'}
            </p>
          </div>

          <CardContent className="p-6">
            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 border border-red-100">
                {error}
              </div>
            )}

            {mode === 'setup' ? (
              <form onSubmit={handleSetup} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1A1A2E]">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Admin name"
                      className="pl-10 h-11 rounded-lg border-[#E5E7EB] focus:border-[#2D2D2D] focus:ring-[#2D2D2D]/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1A1A2E]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@shrivaari.com"
                      className="pl-10 h-11 rounded-lg border-[#E5E7EB] focus:border-[#2D2D2D] focus:ring-[#2D2D2D]/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1A1A2E]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="pl-10 pr-10 h-11 rounded-lg border-[#E5E7EB] focus:border-[#2D2D2D] focus:ring-[#2D2D2D]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#1A1A2E] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-lg h-11 font-semibold transition-colors"
                >
                  {submitting ? 'Creating...' : (
                    <>
                      Create Admin Account <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1A1A2E]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@shrivaari.com"
                      className="pl-10 h-11 rounded-lg border-[#E5E7EB] focus:border-[#2D2D2D] focus:ring-[#2D2D2D]/20"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1A1A2E]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-11 rounded-lg border-[#E5E7EB] focus:border-[#2D2D2D] focus:ring-[#2D2D2D]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#1A1A2E] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-lg h-11 font-semibold transition-colors"
                >
                  {submitting ? 'Signing in...' : (
                    <>
                      Sign In <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-sm text-[#4B5563] hover:text-[#1A1A2E] transition-colors"
              >
                ← Back to website
              </button>
              {mode === 'login' && (
                <div className="flex items-center gap-1 text-sm text-[#4B5563]">
                  <Shield className="w-3.5 h-3.5" />
                  Secured access
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
