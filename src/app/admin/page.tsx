'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import UserList from '@/components/admin/UserList'
import { Shield, Users, BarChart3, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }

    // Check if user is admin (you can implement your own admin logic here)
    // For now, we'll check if the email contains 'admin' or if it's a specific email
    if (user) {
      const adminEmails = ['alpinereasoningcontest@gmail.com', 'zhengm58@gmail.com'] // Add your admin emails
      const isUserAdmin = adminEmails.includes(user.email?.toLowerCase() || '')
      setIsAdmin(isUserAdmin)
      
      if (!isUserAdmin) {
        router.push('/dashboard')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Arcane Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Admin: {user.email}</span>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Total Users</h3>
                <p className="text-2xl font-bold text-blue-400">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Active Users</h3>
                <p className="text-2xl font-bold text-green-400">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">System Status</h3>
                <p className="text-2xl font-bold text-purple-400">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <UserList />
      </main>
    </div>
  )
}
