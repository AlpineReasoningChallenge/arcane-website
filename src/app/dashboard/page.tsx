'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import CountdownTimer from '@/components/dashboard/CountdownTimer'
import PuzzleGrid from '@/components/dashboard/PuzzleGrid'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

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
              <h1 className="text-2xl font-bold text-white font-arcane">The Notebook</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Welcome, {userProfile?.username || userProfile?.full_name || user.email}
              </span>
              <a
                href="https://discord.gg/3yYhcwEgZT"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/30 hover:border-white/50 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Get Support
              </a>
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
      <main className="flex gap-8 max-w-[70vw] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Left Content */}
        <div className="flex-1 max-w-7xl">
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
        </div>

        {/* Right Side - Journal Page */}
        <div className="hidden lg:block flex-shrink-0 w-96 mt-16">
          <Image
            src="/journalpage1.png"
            alt="Journal Page"
            width={400}
            height={1000}
            className="w-full h-auto object-contain rounded-sm"
            priority={false}
          />
        </div>
      </main>
    </div>
  )
}
