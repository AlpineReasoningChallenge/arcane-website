'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { sanitizeInput, isAfterTimestamp, isBeforeTimestamp } from '@/lib/utils'
import { X, CheckCircle, XCircle, Loader2, Clock, Lock } from 'lucide-react'

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
  submissionsAllowed: boolean
  competitionStart?: Date | null
  competitionEnd?: Date | null
}

export default function PuzzleModal({ 
  puzzle, 
  onClose, 
  onSubmission, 
  userAttempts, 
  submissionsAllowed,
  competitionStart,
  competitionEnd 
}: PuzzleModalProps) {
  const { user } = useAuth()
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('')
  const [showStatus, setShowStatus] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Get current competition status
  const competitionStatus = useMemo(() => {
    if (!competitionStart || !competitionEnd) return 'not-configured'
    
    // Use timezone-aware utility functions for proper timestamptz handling
    if (isBeforeTimestamp(competitionStart)) return 'not-started'
    if (isAfterTimestamp(competitionEnd)) return 'ended'
    return 'active'
  }, [competitionStart, competitionEnd])

  // Memoize existing attempt to prevent recalculation
  const existingAttempt = useMemo(() =>
    userAttempts.find(a => a.puzzle_id === puzzle.id),
    [userAttempts, puzzle.id]
  )

  useEffect(() => {
    if (existingAttempt) {
      setAnswer(existingAttempt.answer)
    }
  }, [existingAttempt])

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Memoize the submit handler to prevent recreation on every render
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !answer.trim()) return

    // Check if submissions are allowed
    if (!submissionsAllowed) return

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
              submitted_at: new Date().toISOString() // This will be converted to UTC by Supabase
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
            })
        }

      if (result.error) throw result.error

      // Show success message
      if (puzzle.id === 0) {
        setStatusMessage('Answers are normally only graded twice a day. For this tutorial, we\'ve instantly graded it. Scroll down to see the result!')
      } else {
        setStatusMessage('Answer submitted successfully! You will be emailed if the submission is correct.')
      }
      setStatusType('success')
      setShowStatus(true)

      // Refresh user attempts
      onSubmission()

      // Hide status message after 3 seconds
      setTimeout(() => {
        setShowStatus(false)
      }, 6000)

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setStatusMessage(errorMessage)
      setStatusType('error')
      setShowStatus(true)
    } finally {
      setLoading(false)
    }
  }, [user, answer, existingAttempt, puzzle.id, onSubmission, submissionsAllowed])

  // Memoize the close handler
  const handleClose = useCallback(() => {
    setAnswer('')
    setStatusMessage('')
    setStatusType('')
    setShowStatus(false)
    onClose()
  }, [onClose])

  // Memoize status styling to prevent recalculation
  const statusStyling = useMemo(() => {
    if (statusType === 'success') {
      // Special yellow styling for tutorial puzzle
      if (puzzle.id === 0) {
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
      }
      return 'bg-green-500/20 border-green-500/50 text-green-300'
    }
    return 'bg-red-500/20 border-red-500/50 text-red-300'
  }, [statusType, puzzle.id])

  // Get submission status message
  const getSubmissionStatusMessage = () => {
    switch (competitionStatus) {
      case 'not-configured':
        return 'Competition timing not configured'
      case 'not-started':
        return 'Competition has not started yet'
      case 'ended':
        return 'Competition has ended'
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-surface/95 backdrop-blur-lg rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-secondary/30 shadow-glow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary/30">
          <h2 className="text-2xl font-bold text-white font-arcane">{puzzle.name}</h2>
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
            <img
              src={puzzle.modal_image_url}
              alt={puzzle.name}
              className="w-full h-auto rounded-lg border border-secondary/30"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: puzzle.description }}
            />
          </div>

          {/* Submission Status Warning */}
          {!submissionsAllowed && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-300">
                {competitionStatus === 'not-started' ? (
                  <Clock size={20} />
                ) : (
                  <Lock size={20} />
                )}
                <span className="font-medium">
                  {getSubmissionStatusMessage()}
                </span>
              </div>
              {competitionStart && competitionEnd && (
                <div className="mt-2 text-sm text-yellow-400">
                  Competition runs from {competitionStart.toLocaleDateString()} to {competitionEnd.toLocaleDateString()}
                </div>
              )}
            </div>
          )}

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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={puzzle.id === 0 ? "Enter '0' to complete the tutorial" : (submissionsAllowed ? "Enter your answer here..." : "Submissions are currently disabled")}
                rows={2}
                required
                disabled={loading || !submissionsAllowed}
              />
            </div>

            {/* Status message */}
            {showStatus && (
              <div className={`p-4 rounded-lg border ${statusStyling}`}>
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
              disabled={loading || !answer.trim() || !submissionsAllowed}
              className="w-full bg-gradient-glow text-white font-bold py-3 px-6 rounded-xl hover:shadow-glow-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Submitting...
                </div>
              ) : !submissionsAllowed ? (
                'Submissions Disabled'
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
                Status: {existingAttempt.is_correct === true ? (
                  <span className="text-green-400">Correct</span>
                ) : existingAttempt.is_correct === false ? (
                  <span className="text-red-400">Incorrect</span>
                ) : (
                  <span className="text-yellow-400">In Progress</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
