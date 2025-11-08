'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getUserIPAddress } from '@/lib/utils'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

interface AuthFormProps {
  onSuccess: () => void
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // Get user's IP address
        const ipAddress = await getUserIPAddress()

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              full_name: fullName,
              ip_address: ipAddress,
            },
          },
        })
        if (error) throw error
        setError('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onSuccess()
        // Force immediate redirect to dashboard
        window.location.href = '/dashboard'
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-secondary/30">
        <div className="text-center mb-10">
          {/* Arcane Logo */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-black rounded-lg transform rotate-45"></div>
              <div className="absolute inset-2 bg-surface rounded-lg transform rotate-45"></div>
              <div className="absolute inset-4 bg-secondary rounded-lg transform rotate-45 animate-pulse-glow"></div>
            </div>
          </div>
          
          <h2 className="text-4xl font-arcane text-white mb-3 tracking-wider">
            {isSignUp ? 'JOIN THE HUNT' : 'OPEN THE NOTEBOOK'}
          </h2>
          <p className="text-gray-300 text-lg font-light">
            {isSignUp ? 'Create your account to begin' : 'Sign in to start the hunt'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {isSignUp && (
            <>
              <div>
                <label htmlFor="username" className="block text-lg font-medium text-gray-300 mb-3">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-6 py-4 bg-surface-light/50 border border-secondary/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-lg transition-all duration-300"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div>
                <label htmlFor="fullName" className="block text-lg font-medium text-gray-300 mb-3">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-6 py-4 bg-surface-light/50 border border-secondary/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-lg transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-3">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-surface-light/50 border border-secondary/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-lg transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-300 mb-3">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-surface-light/50 border border-secondary/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pr-16 text-lg transition-all duration-300"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-secondary transition-colors"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={`rounded-xl p-4 text-lg border ${
              error === 'Check your email for the confirmation link!' 
                ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-glow text-white font-bold py-4 px-6 rounded-xl hover:shadow-glow-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-3" size={24} />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-300 hover:text-secondary transition-colors text-lg font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  )
}
