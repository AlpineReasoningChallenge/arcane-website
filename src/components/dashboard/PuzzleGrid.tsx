'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { isBetweenTimestamps } from '@/lib/utils'
import PuzzleModal from './PuzzleModal'

interface Puzzle {
  id: number
  name: string
  description: string
  image_url: string
  modal_image_url: string
}

interface UserAttempt {
  id: number
  puzzle_id: number
  answer: string
  is_correct: boolean
}

interface PuzzleGridProps {
  competitionStart?: Date | null
  competitionEnd?: Date | null
}

export default function PuzzleGrid({ competitionStart, competitionEnd }: PuzzleGridProps) {
  const { user } = useAuth()
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [userAttempts, setUserAttempts] = useState<UserAttempt[]>([])
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if submissions are currently allowed
  const submissionsAllowed = useMemo(() => {
    // Admin user can always submit regardless of dates
    if (user?.email === 'alpinereasoningcontest@gmail.com') return true
    
    // Use timezone-aware utility function for proper timestamptz handling
    return isBetweenTimestamps(competitionStart || null, competitionEnd || null)
  }, [competitionStart, competitionEnd, user?.email])

  // Memoize fetch functions to prevent recreation on every render
  const fetchPuzzles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .eq('is_active', true)
        .order('id')

      if (error) throw error
      setPuzzles(data || [])
    } catch (error) {
      console.error('Error fetching puzzles:', error)
    }
  }, [])

  const fetchUserAttempts = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_puzzle_attempts')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setUserAttempts(data || [])
    } catch (error) {
      console.error('Error fetching user attempts:', error)
    }
  }, [user])

  // Combined useEffect to fetch data efficiently
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([
        fetchPuzzles(),
        user ? fetchUserAttempts() : Promise.resolve()
      ])
      setLoading(false)
    }

    fetchData()
  }, [fetchPuzzles, fetchUserAttempts, user])

  // Check if all puzzles 1-7 are completed
  const allPuzzlesCompleted = useMemo(() => {
    const puzzles1to7 = userAttempts.filter(attempt => 
      attempt.puzzle_id >= 1 && attempt.puzzle_id <= 7
    )
    return puzzles1to7.length === 7 && puzzles1to7.every(attempt => attempt.is_correct)
  }, [userAttempts])

  // Filter puzzles to conditionally include ID 8
  const filteredPuzzles = useMemo(() => {
    return puzzles.filter(puzzle => {
      if (puzzle.id === 8) return allPuzzlesCompleted // Only show puzzle 8 when all others are completed
      return puzzle.id >= 1 && puzzle.id <= 7 // Always show puzzles 1-7
    })
  }, [puzzles, allPuzzlesCompleted])

  // Memoize status calculations to prevent unnecessary re-computations
  const getPuzzleStatus = useCallback((puzzleId: number): string => {
    const attempt = userAttempts.find(a => a.puzzle_id === puzzleId)
    if (!attempt) return 'locked'
    if (attempt.is_correct === null) return 'attempted'
    if (attempt.is_correct === false) return 'incorrect'
    if (attempt.is_correct === true) return 'correct'
    return 'locked' // Default fallback
  }, [userAttempts])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'correct':
        return 'border-green-500 bg-green-500/20'
      case 'incorrect':
        return 'border-red-500 bg-red-500/20'
      case 'attempted':
        return 'border-yellow-500 bg-yellow-500/20'
      default:
        return 'border-secondary bg-secondary/20'
    }
  }, [])

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'correct':
        return '✅'
      case 'incorrect':
        return '❌'
      case 'attempted':
        return '⚠️'
      default:
        return '🔒'
    }
  }, [])

  // Memoize puzzle positions to prevent recalculation on every render
  const puzzlePositions = useMemo(() => {
    // Responsive radius based on screen size
    const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 200
    const centerX = 0
    const centerY = 0

    return filteredPuzzles.map((puzzle, index) => {
      const status = getPuzzleStatus(puzzle.id)
      
      // Special handling for puzzle ID 8 (center position)
      if (puzzle.id === 8) {
        return {
          puzzle,
          x: centerX,
          y: centerY,
          angle: 0,
          status,
          isCenter: true
        }
      }

      // For puzzles 1-7, arrange them in a circle
      const circlePuzzles = filteredPuzzles.filter(p => p.id >= 1 && p.id <= 7)
      const circleIndex = circlePuzzles.findIndex(p => p.id === puzzle.id)
      const angle = (circleIndex * 2 * Math.PI) / circlePuzzles.length - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      return {
        puzzle,
        x,
        y,
        angle,
        status,
        isCenter: false
      }
    })
  }, [filteredPuzzles, getPuzzleStatus])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-glow rounded-full border-2 border-white/30 flex items-center justify-center animate-pulse-glow">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Tutorial Button for Puzzle ID 0 */}
      <div className="text-center" style={{ marginBottom: '-16px' }}>
        <button
          onClick={() => {
            // Find puzzle ID 0 and open its modal
            const tutorialPuzzle = puzzles.find(p => p.id === 0)
            if (tutorialPuzzle) {
              setSelectedPuzzle(tutorialPuzzle)
            }
          }}
          className="bg-gradient-glow text-white font-bold px-6 py-3 rounded-lg hover:shadow-glow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-2xl text-base"
        >
          📚 0. [tutorial]
        </button>
        <p className="text-gray-400 mt-1 text-xs">
          Learn how to submit answers
        </p>
      </div>

      {/* Center point for reference - only show when puzzle 8 is not visible */}
      {!allPuzzlesCompleted && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-secondary rounded-full opacity-50 shadow-glow"></div>
      )}

      {/* Puzzle circles arranged in a circle */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
        {puzzlePositions.map(({ puzzle, x, y, angle, status, isCenter }) => (
          <div
            key={puzzle.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 group`}
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
            onClick={() => setSelectedPuzzle(puzzle)}
          >
            {/* Puzzle circle */}
            <div className={`relative ${isCenter ? 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40' : 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32'} rounded-full border-4 ${getStatusColor(status)} overflow-hidden transition-all duration-300 group-hover:border-secondary group-hover:shadow-glow-xl group-hover:shadow-secondary/50`}>
              {/* Background image */}
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundImage: `url(${puzzle.modal_image_url})` }}
              />

              {/* Overlay with puzzle name */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
                <div className="text-center">
                  <div className="text-2xl mb-1">{getStatusIcon(status)}</div>
                  <div className={`text-white font-medium px-2 leading-tight ${isCenter ? 'text-xs sm:text-sm md:text-base' : 'text-xs'} hidden sm:block`}>
                    {puzzle.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Connection line to center - only for non-center puzzles */}
            {!isCenter && (
              <div
                className="absolute w-px bg-gradient-to-b from-secondary/50 to-transparent transform origin-top"
                style={{
                  height: `${200}px`,
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${angle * 180 / Math.PI}deg)`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Puzzle Modal */}
      {selectedPuzzle && (
        <PuzzleModal
          puzzle={selectedPuzzle}
          onClose={() => setSelectedPuzzle(null)}
          onSubmission={fetchUserAttempts}
          userAttempts={userAttempts}
          submissionsAllowed={submissionsAllowed}
          competitionStart={competitionStart}
          competitionEnd={competitionEnd}
        />
      )}
    </div>
  )
}
