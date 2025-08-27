'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
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

export default function PuzzleGrid() {
  const { user } = useAuth()
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [userAttempts, setUserAttempts] = useState<UserAttempt[]>([])
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPuzzles()
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserAttempts()
    }
  }, [user])

  const fetchPuzzles = async () => {
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
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAttempts = async () => {
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
  }

  const getPuzzleStatus = (puzzleId: number) => {
    const attempt = userAttempts.find(a => a.puzzle_id === puzzleId)
    if (!attempt) return 'locked'
    return attempt.is_correct ? 'completed' : 'attempted'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-500/20'
      case 'attempted':
        return 'border-yellow-500 bg-yellow-500/20'
      default:
        return 'border-purple-500 bg-purple-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'attempted':
        return '⚠️'
      default:
        return '🔒'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // Calculate positions for circular arrangement
  const radius = 200 // Adjust based on screen size
  const centerX = 0
  const centerY = 0

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Center point for reference */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full opacity-50"></div>
      
      {/* Puzzle circles arranged in a circle */}
      <div className="relative w-full h-[600px] md:h-[700px]">
        {puzzles.map((puzzle, index) => {
          const angle = (index * 2 * Math.PI) / puzzles.length - Math.PI / 2
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          const status = getPuzzleStatus(puzzle.id)
          
          return (
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
              <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 ${getStatusColor(status)} overflow-hidden transition-all duration-300 group-hover:border-purple-400 group-hover:shadow-2xl group-hover:shadow-purple-500/50`}>
                {/* Background image */}
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundImage: `url(${puzzle.image_url})` }}
                />
                
                {/* Overlay with puzzle name */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
                  <div className="text-center">
                    <div className="text-2xl mb-1">{getStatusIcon(status)}</div>
                    <div className="text-xs md:text-sm text-white font-medium px-2 leading-tight">
                      {puzzle.name}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Connection line to center (optional) */}
              <div 
                className="absolute w-px bg-gradient-to-b from-purple-500/50 to-transparent transform origin-top"
                style={{
                  height: `${radius}px`,
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${angle * 180 / Math.PI}deg)`,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Puzzle Modal */}
      {selectedPuzzle && (
        <PuzzleModal
          puzzle={selectedPuzzle}
          onClose={() => setSelectedPuzzle(null)}
          onSubmission={fetchUserAttempts}
          userAttempts={userAttempts}
        />
      )}
    </div>
  )
}
