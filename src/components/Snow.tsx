'use client'

import { useEffect, useState, useRef } from 'react'

interface SnowProps {
  isActive: boolean
}

const snowflakes = ['❄', '❅', '❆', '•', '·', '✻', '✼', '❉', '❊', '❋']

export default function Snow({ isActive }: SnowProps) {
  const [snowElements, setSnowElements] = useState<JSX.Element[]>([])
  const [snowIntensity, setSnowIntensity] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const intensityRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Smoothly transition snow intensity
    if (intensityRef.current) {
      clearTimeout(intensityRef.current)
    }

    if (isActive) {
      // Gradually increase snow intensity
      const increaseIntensity = () => {
        setSnowIntensity(prev => {
          if (prev < 1) {
            intensityRef.current = setTimeout(increaseIntensity, 100)
            return Math.min(prev + 0.1, 1)
          }
          return 1
        })
      }
      increaseIntensity()
    } else {
      // Gradually decrease snow intensity
      const decreaseIntensity = () => {
        setSnowIntensity(prev => {
          if (prev > 0) {
            intensityRef.current = setTimeout(decreaseIntensity, 100)
            return Math.max(prev - 0.1, 0)
          }
          return 0
        })
      }
      decreaseIntensity()
    }

    return () => {
      if (intensityRef.current) {
        clearTimeout(intensityRef.current)
      }
    }
  }, [isActive])

  useEffect(() => {
    if (snowIntensity === 0) {
      // Stop creating new snow when intensity reaches 0
      // But don't clear existing snow - let them finish falling
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Create snow effect based on intensity
    const createSnowflake = () => {
      const snowflake = snowflakes[Math.floor(Math.random() * snowflakes.length)]
      const left = Math.random() * 100
      const animationDuration = Math.random() * 1 + 0.5 // 0.5-1.5 seconds (very fast)
      const size = Math.random() * 25 + 8 // 8-33px (more varied)
      const delay = Math.random() * 0.1 // 0-0.1 seconds delay (almost immediate start)

      const snowElement = (
        <div
          key={Date.now() + Math.random()}
          className="snowflake"
          style={{
            left: `${left}%`,
            fontSize: `${size}px`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${delay}s`,
            opacity: snowIntensity * 0.9, // Fade with intensity
          }}
        >
          {snowflake}
        </div>
      )

      setSnowElements(prev => [...prev, snowElement])

      // Remove snowflake after animation completes
      setTimeout(() => {
        setSnowElements(prev => prev.filter(el => el !== snowElement))
      }, (animationDuration + delay) * 1000)
    }

    // Create snowflakes based on intensity (more intense = more snow)
    const interval = Math.max(50, 200 - (snowIntensity * 150)) // 50-200ms intervals
    intervalRef.current = setInterval(createSnowflake, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [snowIntensity])

  // Only hide when there are no snow elements left
  if (snowElements.length === 0) return null

  return <>{snowElements}</>
}
