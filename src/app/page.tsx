'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Snow from '@/components/Snow'

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
      answer: "EVERYONE who completes all puzzles will win [tbd]. The top three participants will respectively win [tbd]. For these winners, a video call with the Arcane team will be required to redeem their prizes."
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


      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Top Right Buttons */}
        <div className="absolute top-8 right-8 z-20 flex gap-4">
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
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-12">
            {/* Central Arcane Symbol */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative w-32 h-32">
                {/* Outer A Shape */}
                <div className="absolute inset-0 bg-black transform rotate-0">
                  <div className="w-full h-full bg-gradient-to-b from-surface-light to-surface-dark clip-path-a"></div>
                </div>
                {/* Inner Glow */}
                <div className="absolute inset-4 bg-secondary/20 rounded-lg animate-pulse-glow"></div>
                {/* Central Diamond */}
                <div className="absolute inset-8 bg-secondary rounded-lg transform rotate-45 animate-glow"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl md:text-8xl font-arcane text-white mb-8 tracking-wider">
            SEVEN PUZZLES
          </h2>
          
          <h2 className="text-7xl md:text-9xl font-arcane text-secondary mb-12 tracking-wider animate-pulse-glow">
            ARCANE
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            Embark on a mystical journey through the mountains. Retrace the steps of those before you by analyzing{' '}
            <span className="glitch-text text-secondary font-bold" data-text="7 artifacts">7 artifacts</span>
            {' '}and rediscover secrets of the past.
          </p>
          
          <div className="flex justify-center">
            {!user && (
              <button
                onClick={() => setShowAuth(true)}
                className="group bg-gradient-glow text-white text-2xl font-bold px-12 py-6 rounded-2xl hover:shadow-glow-xl transition-all duration-500 transform hover:scale-110"
              >
                <span className="flex items-center">
                  Unlock the Puzzles
                  <ChevronDown className="ml-3 h-8 w-8 transform group-hover:translate-y-1 transition-transform" />
                </span>
              </button>
            )}
          </div>
        </div>
      </section>



      {/* Lore Section */}
      <section ref={loreSectionRef} className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-arcane text-white mb-8 tracking-wider">THE STORY SO FAR</h2>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto mb-10 leading-relaxed font-light">
            At 1,434m above sea level in the Canadian Rockies, you are trapped by a blizzard and your equipment is lost. Searching for your gear, you find a <span className="text-orange-400 font-semibold">neon orange backpack</span>. Inside, there is a peculiar <span className="glitch-text text-secondary font-bold" data-text="notebook">notebook</span>—ink running in splotches, pages damaged by water—and a faint date referring to a time three decades ago...what happened to the hiker to whom it belonged?
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
                  &nbsp;&nbsp;&nbsp;&nbsp;Your numb fingers fumble with the zipper. The backpack contained nothing but a jumble of torn pages from a notebook; each one hastily scrawled upon. The yellowed pages were almost illegible—the ink running in splotches, the pages damaged by water—a faint date on one of the pages referred to a time three decades ago… what happened to the hiker to whom the backpack belonged?
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
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-arcane text-white mb-6 tracking-wider">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="text-2xl text-gray-300 font-light">
              Everything you need to know about the Arcane puzzle hunt competition.
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
