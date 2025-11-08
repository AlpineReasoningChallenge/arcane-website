'use client'

import { useState, useEffect } from 'react'
import { isAfterTimestamp, isBeforeTimestamp } from '@/lib/utils'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  targetDate: Date
  endDate?: Date // Optional end date for when the hunt ends
}

export default function CountdownTimer({ targetDate, endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isHuntLive, setIsHuntLive] = useState(false)
  const [isHuntEnded, setIsHuntEnded] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Use timezone-aware utility functions for proper timestamptz handling
      const now = new Date()
      
      // Check if hunt has started
      if (isAfterTimestamp(targetDate)) {
        setIsHuntLive(true)
        
        // If hunt has started, count down to end date
        if (endDate && isBeforeTimestamp(endDate)) {
          const difference = endDate.getTime() - now.getTime()
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          })
          setIsHuntEnded(false)
        } else if (endDate && isAfterTimestamp(endDate)) {
          // Hunt has ended
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
          setIsHuntEnded(true)
        } else {
          // No end date specified, just show hunt is live
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
          setIsHuntEnded(false)
        }
      } else {
        // Hunt hasn't started yet, count down to start
        setIsHuntLive(false)
        setIsHuntEnded(false)
        const difference = targetDate.getTime() - now.getTime()
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, endDate])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-glow rounded-full border-2 border-secondary/50 flex items-center justify-center backdrop-blur-sm shadow-glow">
          <span className="text-4xl md:text-6xl font-bold text-white font-arcane">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-glow rounded-full border-2 border-secondary/50 animate-pulse-glow opacity-75"></div>
      </div>
      <span className="text-lg md:text-xl text-gray-300 mt-3 font-medium">{label}</span>
    </div>
  )

  // Determine the title and status message based on hunt state
  const getTitle = () => {
    if (isHuntEnded) return "The Hunt Has Ended"
    if (isHuntLive) return "The Hunt Ends In"
    return "The Hunt Starts In"
  }

  const getStatusMessage = () => {
    if (isHuntEnded) {
      return (
        <div className="mt-8">
          <div className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg">
            🏁 Competition Closed. Check your email for upates! 🏁
          </div>
        </div>
      )
    }
    
    if (isHuntLive) {
      return (
        <div className="mt-8">
          <div className="inline-block bg-gradient-glow text-white px-8 py-4 rounded-full text-xl font-bold animate-pulse-glow shadow-glow">
            🎉 ARCANE is Live! 🎉
          </div>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-arcane">
        {getTitle()}
      </h2>
      
      {/* Only show countdown if there's time left */}
      {(timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <TimeUnit value={timeLeft.minutes} label="Minutes" />
          <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      )}
      
      {/* Status message */}
      {getStatusMessage()}
    </div>
  )
}
