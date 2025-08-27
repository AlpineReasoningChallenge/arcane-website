'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  targetDate: Date
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full border-2 border-purple-500/50 flex items-center justify-center backdrop-blur-sm">
          <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full border-2 border-purple-500/50 animate-pulse opacity-75"></div>
      </div>
      <span className="text-lg md:text-xl text-gray-300 mt-3 font-medium">{label}</span>
    </div>
  )

  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        The Hunt Begins In
      </h2>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
      
      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
        <div className="mt-8">
          <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full text-xl font-bold animate-pulse">
            🎉 The Hunt is Live! 🎉
          </div>
        </div>
      )}
    </div>
  )
}
