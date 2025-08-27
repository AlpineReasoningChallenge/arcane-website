'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import CountdownTimer from '@/components/dashboard/CountdownTimer'
import PuzzleGrid from '@/components/dashboard/PuzzleGrid'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  username: string | null
  full_name: string | null
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [competitionStart, setCompetitionStart] = useState<Date | null>(null)
  const [competitionEnd, setCompetitionEnd] = useState<Date | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Memoize the fetch function to prevent recreation on every render
  const fetchCompetitionSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('competition_settings')
        .select('start_date, end_date')
        .eq('is_active', true)
        .single()

      if (error) throw error
      if (data) {
        setCompetitionStart(new Date(data.start_date))
        if (data.end_date) {
          setCompetitionEnd(new Date(data.end_date))
        }
      }
    } catch (error) {
      console.error('Error fetching competition settings:', error)
      // Fallback to a default date (7 days from now)
      const defaultStart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      const defaultEnd = new Date(defaultStart.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days after start
      setCompetitionStart(defaultStart)
      setCompetitionEnd(defaultEnd)
    }
  }, [])

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, username, full_name')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [user])

  useEffect(() => {
    fetchCompetitionSettings()
    fetchUserProfile()
  }, [fetchCompetitionSettings, fetchUserProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-arcane flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-glow rounded-full border-2 border-white/30 flex items-center justify-center animate-pulse-glow">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-arcane">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white font-arcane">Arcane</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Welcome, {userProfile?.username || userProfile?.full_name || user.email}
              </span>
              <button
                onClick={async () => {
                  await signOut()
                  // Force immediate redirect
                  window.location.href = '/'
                }}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/30 hover:border-white/50"
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
          <CountdownTimer 
            targetDate={competitionStart} 
            endDate={competitionEnd || undefined}
          />
        )}

        {/* Puzzle Grid */}
        {/* <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-arcane">
            The Seven Seals
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Click on each seal to reveal its challenge. Solve all seven to claim your victory in the Arcane realm.
          </p>
        </div> */}

        <PuzzleGrid 
          competitionStart={competitionStart}
          competitionEnd={competitionEnd}
        />
      </main>
    </div>
  )
}
