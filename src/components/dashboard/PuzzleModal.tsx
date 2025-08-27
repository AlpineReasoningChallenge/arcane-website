'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { sanitizeInput } from '@/lib/utils'
import { X, CheckCircle, XCircle, Loader2 } from 'lucide-react'

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

interface PuzzleModalProps {
  puzzle: Puzzle
  onClose: () => void
  onSubmission: () => void
  userAttempts: UserAttempt[]
}

export default function PuzzleModal({ puzzle, onClose, onSubmission, userAttempts }: PuzzleModalProps) {
  const { user } = useAuth()
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('')
  const [showStatus, setShowStatus] = useState(false)

  const existingAttempt = userAttempts.find(a => a.puzzle_id === puzzle.id)

  useEffect(() => {
    if (existingAttempt) {
      setAnswer(existingAttempt.answer)
    }
  }, [existingAttempt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !answer.trim()) return

    setLoading(true)
    setStatusMessage('')
    setStatusType('')
    setShowStatus(false)

    try {
      // Sanitize input to prevent SQL injection
      const sanitizedAnswer = sanitizeInput(answer)

      let result
      if (existingAttempt) {
        // Update existing attempt
        result = await supabase
          .from('user_puzzle_attempts')
          .update({ 
            answer: sanitizedAnswer,
            is_correct: false, // You'll need to implement answer validation logic
            submitted_at: new Date().toISOString()
          })
          .eq('id', existingAttempt.id)
      } else {
        // Create new attempt
        result = await supabase
          .from('user_puzzle_attempts')
          .insert({
            user_id: user.id,
            puzzle_id: puzzle.id,
            answer: sanitizedAnswer,
            is_correct: false // You'll need to implement answer validation logic
          })
      }

      if (result.error) throw result.error

      // Show success message
      setStatusMessage('Answer submitted successfully!')
      setStatusType('success')
      setShowStatus(true)

      // Refresh user attempts
      onSubmission()

      // Hide status message after 3 seconds
      setTimeout(() => {
        setShowStatus(false)
      }, 3000)

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setStatusMessage(errorMessage)
      setStatusType('error')
      setShowStatus(true)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setAnswer('')
    setStatusMessage('')
    setStatusType('')
    setShowStatus(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
          <h2 className="text-2xl font-bold text-white">{puzzle.name}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Full-size image */}
          <div className="mb-6">
            <Image
              src={puzzle.modal_image_url}
              alt={puzzle.name}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg border border-purple-500/30"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">{puzzle.description}</p>
          </div>

          {/* Answer form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-300 mb-2">
                Your Answer
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Enter your answer here..."
                rows={4}
                required
                disabled={loading}
              />
            </div>

            {/* Status message */}
            {showStatus && (
              <div className={`p-4 rounded-lg border ${
                statusType === 'success' 
                  ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                  : 'bg-red-500/20 border-red-500/50 text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  {statusType === 'success' ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <XCircle size={20} className="text-red-400" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !answer.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Submitting...
                </div>
              ) : (
                existingAttempt ? 'Update Answer' : 'Submit Answer'
              )}
            </button>
          </form>

          {/* Previous attempt info */}
          {existingAttempt && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Previous Attempt</h4>
              <p className="text-sm text-gray-400">
                You previously submitted: <span className="text-white">{existingAttempt.answer}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Status: <span className={existingAttempt.is_correct ? 'text-green-400' : 'text-yellow-400'}>
                  {existingAttempt.is_correct ? 'Correct' : 'Incorrect'}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
