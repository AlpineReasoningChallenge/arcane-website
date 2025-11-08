'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Snow from '@/components/Snow'
import Image from 'next/image'
import { Analytics } from '@vercel/analytics/next';

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)

  // Auto-redirect to dashboard when user becomes authenticated
  useEffect(() => {
    if (user && !showAuth) {
      router.push('/dashboard')
    }
  }, [user, showAuth, router])

  const handleAuthSuccess = () => {
    // Close the auth modal, the useEffect will handle the redirect
    setShowAuth(false)
  }

  const faqs = [
    {
      question: "What is Arcane?",
      answer: "Arcane is a virtual puzzle hunt competition that challenges participants to solve seven puzzles. Each puzzle is designed with a unique theme and requires creative thinking, pattern recognition, and problem-solving skills for successful completion."
    },
    {
      question: "How do I participate?",
      answer: "Simply create an account and log in to access your dashboard. Once the competition begins, you'll see seven circular seals arranged in a circle. Click on each seal to reveal its challenge and submit your answer."
    },
    {
      question: "What do we win?",
      answer: "There is a total prize pool of $200 CAD. For the winners, a video call with the Arcane team will be required to redeem their prizes."
    },
    {
      question: "When does the competition start?",
      answer: "The competition has a countdown timer on the dashboard. Once it reaches zero, submissions will be closed."
    },
    {
      question: "How are winners determined?",
      answer: "Winners are determined by the speed and accuracy of puzzle solutions. The first participant to correctly solve all seven puzzles wins. In case of ties, the earliest submission time breaks the tie. 1st to 3rd place will be awarded prizes."
    },
    {
      question: "Can I submit multiple answers?",
      answer: "Yes, you can update your answers as many times as needed before the competition ends. However, only your final submission for each puzzle will be considered for scoring. Scoring happens twice a day and the scoring results will be emailed + updated in the dashboard."
    },
    {
      question: "What happens if I can't solve a puzzle?",
      answer: "Don't worry! Each puzzle is designed to be solvable with careful observation and logical thinking. Puzzles can also be solved out of order. Take your time, and remember that sometimes the answer lies in the details you might have overlooked."
    },
    {
      question: "Is there a time limit?",
      answer: "While there's no strict time limit for individual puzzles, the overall competition has a deadline. Check the dashboard for the countdown timer."
    }
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [isLoreInView, setIsLoreInView] = useState(false)
  const loreSectionRef = useRef<HTMLElement>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Intersection observer for lore section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsLoreInView(entry.isIntersecting)
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '-50px 0px'
      }
    )

    if (loreSectionRef.current) {
      observer.observe(loreSectionRef.current)
    }

    return () => {
      if (loreSectionRef.current) {
        observer.unobserve(loreSectionRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-arcane">
      {/* Snow Effect - Only active when lore section is in view */}
      <Snow isActive={isLoreInView} />

      <Analytics />
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden grainy-bg">
        {/* Dark Background with Grainy Texture */}
        <div className="absolute inset-0 bg-[#1a1a1f]"></div>
        
        {/* Binary Code Columns */}
        <div className="absolute top-20 left-10 binary-code z-10">
          <div>01</div>
          <div>00</div>
          <div>01</div>
          <div>11</div>
          <div>00</div>
          <div>01</div>
          <div>10</div>
        </div>
        <div className="absolute top-32 left-20 binary-code z-10">
          <div>01</div>
          <div>00</div>
          <div>01</div>
          <div>00</div>
        </div>
        <div className="absolute top-40 right-20 binary-code z-10">
          <div>01</div>
          <div>00</div>
          <div>11</div>
          <div>01</div>
          <div>00</div>
          <div>10</div>
        </div>
        <div className="absolute top-60 right-32 binary-code z-10">
          <div>00</div>
          <div>01</div>
          <div>11</div>
          <div>00</div>
        </div>
        <div className="absolute top-80 left-1/4 binary-code z-10">
          <div>01</div>
          <div>10</div>
          <div>00</div>
          <div>01</div>
          <div>11</div>
        </div>
        
        {/* Numerical Sequence */}
        <div className="absolute top-40 right-40 binary-code z-10 text-white/40">
          <div>1</div>
          <div>4</div>
          <div>3</div>
          <div>4</div>
        </div>
        
        {/* Circuit Lines */}
        <svg className="absolute inset-0 w-full h-full z-5" style={{ pointerEvents: 'none' }}>
          <line x1="10%" y1="25%" x2="15%" y2="30%" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="1" />
          <line x1="80%" y1="35%" x2="85%" y2="40%" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="1" />
          <line x1="25%" y1="50%" x2="30%" y2="55%" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="1" />
          <line x1="75%" y1="60%" x2="80%" y2="90%" stroke="rgba(100, 200, 255, 0.25)" strokeWidth="1" />
          <line x1="20%" y1="45%" x2="25%" y2="50%" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="1" />
          <line x1="15%" y1="30%" x2="20%" y2="35%" stroke="rgba(100, 200, 255, 0.25)" strokeWidth="1" />
          <line x1="85%" y1="40%" x2="90%" y2="85%" stroke="rgba(100, 200, 255, 0.2)" strokeWidth="1" />
          <line x1="30%" y1="55%" x2="35%" y2="60%" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="1" />
        </svg>
        
        {/* Top Right Buttons */}
        <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-4">
          {user ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-glow text-white font-bold px-8 py-4 rounded-xl hover:shadow-glow-xl transition-all duration-300 transform hover:scale-110 border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-2xl"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-gradient-glow text-white font-bold px-8 py-4 rounded-xl hover:shadow-glow-xl transition-all duration-300 transform hover:scale-110 border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-2xl"
            >
              Start Now
            </button>
          )}
          <a
            href="https://discord.gg/3yYhcwEgZT"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-14 h-14 bg-surface/80 hover:bg-surface border-2 border-secondary/30 hover:border-secondary/60 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-glow"
            aria-label="Join Discord"
          >
            <svg
              className="w-7 h-7 text-white group-hover:text-secondary transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
        </div>
        
        {/* ARCANE Title */}
        <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 z-10 text-center">
          {/* SEVEN PUZZLES */}
            <h2 className="text-xl md:text-6xl lg:text-8xl font-arcane text-white mb-6 tracking-wider relative" style={{ top: '-1.5rem' }}>
            SEVEN PUZZLES
          </h2>

          <div className="mb-4" style={{ transform: 'scaleY(1.3)' }}>
            <Image
              src="/logo.png"
              alt="ARCANE"
              width={800}
              height={200}
              className="w-auto h-24 md:h-48 lg:h-56 object-contain"
              priority
            />
          </div>
          
          {/* Description Text */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white max-w-4xl mx-auto mb-8 leading-relaxed font-light px-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] bg-gradient-to-b from-white/10 via-black/40 to-transparent rounded-2xl py-6 backdrop-blur-[2px] border border-white/10 shadow-lg">
            Embark on a mystical journey through the mountains.<br className="hidden md:block" />
            Retrace the steps of those before you by deciphering{' '}
            <span
              className="glitch-text font-bold text-cyan-300 drop-shadow-[0_2px_7px_rgba(0,255,255,0.5)]"
              data-text="7 artifacts"
              style={{ WebkitTextStroke: '1px #00d9ff', textShadow: '0 4px 24px #14445e' }}
            >
              7 artifacts
            </span>
            {' '}and rediscover long-gone secrets.
          </p>
          
          {/* Unlock the Puzzles Button */}
          <div className="flex justify-center mt-8">
            {!user && (
              <button
                onClick={() => setShowAuth(true)}
                className="group bg-gradient-glow text-white text-xl md:text-2xl font-bold px-8 md:px-12 py-4 md:py-6 rounded-2xl hover:shadow-glow-xl transition-all duration-500 transform hover:scale-110"
              >
                <span className="flex items-center">
                  Unlock the Puzzles
                  <ChevronDown className="ml-3 h-6 w-6 md:h-8 md:w-8 transform group-hover:translate-y-1 transition-transform" />
                </span>
              </button>
            )}
          </div>
        </div>
        
        {/* Mountain and Clouds */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 z-0">
          {/* Clouds Background */}
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-white/20 via-white/10 to-transparent overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-white/30 to-transparent blur-xl"></div>
            <div className="absolute bottom-10 left-10 w-64 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-40 bg-white/15 rounded-full blur-3xl"></div>
            <div className="absolute bottom-15 left-1/3 w-72 h-36 bg-white/25 rounded-full blur-2xl"></div>
          </div>
          
          {/* Mountain - Low poly style */}
          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none" style={{ minHeight: '100%' }}>
            {/* Base mountain shape - extends beyond edges */}
            <polygon
              points="-100,600 0,600 300,500 450,340 600,280 750,270 900,300 1200,380 1400,600 1400,600"
              fill="#2a2a35"
              opacity="0.9"
            />
            {/* Mountain facets/segments */}
            <polygon
              points="0,600 300,500 450,340 200,500"
              fill="#1f1f2a"
              opacity="0.7"
            />
            <polygon
              points="450,340 600,280 750,270 550,320"
              fill="#252530"
              opacity="0.8"
            />
            <polygon
              points="750,270 900,300 1200,380 1000,350"
              fill="#1f1f2a"
              opacity="0.7"
            />
            {/* White snow cap on summit */}
            <polygon
              points="600,280 650,265 700,260 750,270 720,275 680,275 640,285"
              fill="#ffffff"
              opacity="0.7"
            />
            <polygon
              points="650,265 700,260 750,270 720,275 680,275"
              fill="#ffffff"
              opacity="0.8"
            />
            {/* Light grey top edges for low-poly effect */}
            <polyline
              points="300,500 450,340 600,280 750,270 900,300 1200,380"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
            />
            {/* Additional facet edges */}
            <line x1="450" y1="340" x2="600" y2="280" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
            <line x1="600" y1="280" x2="750" y2="270" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
            <line x1="750" y1="270" x2="900" y2="300" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
          </svg>
        </div>
      </section>



      {/* Lore Section */}
      <section ref={loreSectionRef} className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-arcane text-white mb-8 tracking-wider">THE STORY SO FAR</h2>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto mb-10 leading-relaxed font-light">
            At 1,434m above sea level in the Canadian Rockies, you are trapped by a blizzard and your equipment has disappeared. Searching for your gear, you find a <span className="text-orange-500 font-semibold drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]">neon orange backpack</span>. Inside, there is a peculiar <span className="glitch-text text-secondary font-bold" data-text="notebook">notebook</span>—ink running in splotches, pages damaged by water—and a faint date referring to a time three decades ago...what happened to the hiker to whom it belonged?
          </p>
          <p className="text-center font-bold text-2xl">
            Nine pages. Seven puzzles. Thirty days.
          </p>
          <p className="text-center font-semibold text-xl">
            Nine pages. Seven puzzles. Thirty days.
          </p>
          <p className="text-center font-medium text-sm">
            Nine pages. Seven puzzles. Thirty days.
          </p>
          <br/>
          <br/>

          <button
            onClick={() => setShowStoryModal(true)}
            className="group bg-gradient-glow text-white font-bold px-10 py-5 rounded-2xl hover:shadow-glow-xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20 hover:border-white/40"
          >
            <span className="flex items-center justify-center text-xl">
              Read Full Story
              <ChevronDown className="ml-3 h-6 w-6 transform group-hover:translate-y-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Story Modal */}
      {showStoryModal && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={() => setShowStoryModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowStoryModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-secondary text-lg font-bold"
            >
              ✕ Close
            </button>
            <div className="bg-surface/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-secondary/30">
              <div className="text-center mb-10">
                <h2 className="text-5xl font-arcane text-white mb-6 tracking-wider">THE COMPLETE STORY</h2>
              </div>
              <div className="text-left text-lg text-gray-300 leading-relaxed space-y-6">
                <p>
                  You step up onto the steep ridgeline. The monotony of boulders instantly gives way to the sheer faces of the valley—the torrential flow of the Galois river, a league below, resounds in your ears. The alpine chill bites your fingers, ignoring your heavy gloves. The jarring dissonances of the city seem so alien in comparison to the euphony of the untouched wilderness. You turn towards the faintly visible summit and begin to scramble.
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;The shadows imperceptibly lengthen as the hours pass. The sapphire sky loses its gleaming quality; you no longer squint as you gaze across the valley for the millionth time. Each strenuous climb led to another—as you pause to rest, you notice that the summit has remained stagnant, still sitting quietly near the horizon. The once-idyllic symphony of nature grows ever more alike to the adversarial cold.
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;A navy sky overlooks you as you begin to seek shelter. The descent would be long and uncharted, as the grassy slopes remain far below the lofty crest. You begin to descend, not before glancing once again toward the distant summit. Your hiking stick becomes more reliable than your vision; as night falls, your small flashlight fails to overpower the darkness. Your legs become heavier; when you reach a small cave, you fall sharply against the rocky ground, your fatigue disregarding the uncomfortable surface.
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;The stars still hang brightly above the slopes as you wake with a jolt. You jerk awake; where was your equipment? Perhaps, you think, it was left behind unnoticed as you were encapsulated by the serene beauty of the range. The sudden onset of panic causes you to hurriedly walk back onto the dark slope—you catch a glance of a neon orange backpack amidst the rocks—you frantically gasp for air as you finally reach it… the night and the soreness cloud your thoughts; you begin to recall that your backpack was green—who else would be here, hundreds of kilometers into the unmapped wilderness? You carry the bag on your back; the familiar weight of hiking gear was strangely absent. As the snow begins to cascade down the jet-black sky, you reach the cave just in time. The climb back up would be unfeasible with such thick snow; there was nothing to do besides waiting.
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;Your numb fingers fumble with the zipper. The backpack contained nothing but a jumble of torn pages from a <span className="glitch-text text-secondary font-bold" data-text="notebook">notebook</span>; each one hastily scrawled upon. The yellowed pages were almost illegible—the ink running in splotches, the pages damaged by water—a faint date on one of the pages referred to a time three decades ago… what happened to the hiker to whom the backpack belonged?
                </p>
                <p className="text-center font-bold text-xl">
                  Nine pages. Seven puzzles. Thirty days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-arcane text-white mb-6 tracking-wider">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="text-2xl text-gray-300 font-light">
              Everything you need to know about the this competition.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-surface/80 backdrop-blur-md rounded-3xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-surface-light/50 transition-colors rounded-3xl"
                >
                  <span className="text-2xl font-arcane text-white tracking-wide">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-6 w-6 text-white" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-white" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-300 leading-relaxed text-lg font-light">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={() => setShowAuth(false)}
        >
          <div 
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-12 right-0 text-white hover:text-secondary text-lg font-bold"
            >
              ✕ Close
            </button>
            <AuthForm onSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}
    </div>
  )
}
