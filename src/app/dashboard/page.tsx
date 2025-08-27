'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import CountdownTimer from '@/components/dashboard/CountdownTimer'
import PuzzleGrid from '@/components/dashboard/PuzzleGrid'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [competitionStart, setCompetitionStart] = useState<Date | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchCompetitionSettings()
  }, [])

  const fetchCompetitionSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('competition_settings')
        .select('start_date')
        .eq('is_active', true)
        .single()

      if (error) throw error
      if (data) {
        setCompetitionStart(new Date(data.start_date))
      }
    } catch (error) {
      console.error('Error fetching competition settings:', error)
      // Fallback to a default date (7 days from now)
      setCompetitionStart(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Arcane Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.email}</span>
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
        {/* Countdown Timer */}
        {competitionStart && (
          <CountdownTimer targetDate={competitionStart} />
        )}

        {/* Puzzle Grid */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Seven Seals
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Click on each seal to reveal its challenge. Solve all seven to claim your victory in the Arcane realm.
          </p>
        </div>

        <PuzzleGrid />
      </main>
    </div>
  )
}
