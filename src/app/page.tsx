'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
import { ChevronDown, ChevronUp, Sparkles, Shield, Users, Trophy } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)

  const handleAuthSuccess = () => {
    router.push('/dashboard')
  }

  const faqs = [
    {
      question: "What is Arcane?",
      answer: "Arcane is a virtual puzzle hunt competition that challenges participants to solve seven mystical puzzles. Each puzzle is designed with a unique theme and requires creative thinking, pattern recognition, and problem-solving skills."
    },
    {
      question: "How do I participate?",
      answer: "Simply create an account and log in to access your dashboard. Once the competition begins, you'll see seven circular seals arranged in a circle. Click on each seal to reveal its challenge and submit your answers."
    },
    {
      question: "When does the competition start?",
      answer: "The competition has a countdown timer on the dashboard. Once it reaches zero, all puzzles become available for solving. You can start working on them immediately!"
    },
    {
      question: "How are winners determined?",
      answer: "Winners are determined by the speed and accuracy of puzzle solutions. The first participant to correctly solve all seven puzzles wins. In case of ties, the earliest submission time breaks the tie."
    },
    {
      question: "Can I submit multiple answers?",
      answer: "Yes, you can update your answers as many times as needed before the competition ends. However, only your final submission for each puzzle will be considered for scoring."
    },
    {
      question: "What happens if I can't solve a puzzle?",
      answer: "Don't worry! Each puzzle is designed to be solvable with careful observation and logical thinking. Take your time, and remember that sometimes the answer lies in the details you might have overlooked."
    },
    {
      question: "Is there a time limit?",
      answer: "While there's no strict time limit for individual puzzles, the overall competition has a deadline. The faster you solve all puzzles, the better your chances of winning!"
    }
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Arcane</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <Sparkles className="h-20 w-20 text-purple-400 mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome to
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Arcane
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Embark on a mystical journey through seven ancient seals. Decipher runes, solve puzzles, and claim your place among the arcane masters.
            </p>
          </div>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Begin Your Quest
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-purple-500 text-purple-400 font-semibold px-8 py-4 rounded-lg text-lg hover:bg-purple-500 hover:text-white transition-all duration-200"
              >
                Learn More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              The Challenge Awaits
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Seven mystical seals guard ancient knowledge. Each seal presents a unique puzzle that will test your wit, creativity, and determination.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Shield className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Secure & Fair</h3>
              <p className="text-gray-300">
                Built with enterprise-grade security. Your progress is protected, and all participants compete on equal footing.
              </p>
            </div>
            <div className="text-center p-6">
              <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Global Competition</h3>
              <p className="text-gray-300">
                Join participants from around the world in this epic battle of wits and problem-solving prowess.
              </p>
            </div>
            <div className="text-center p-6">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Eternal Glory</h3>
              <p className="text-gray-300">
                The first to solve all seven seals earns the title of Arcane Master and eternal recognition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about the Arcane competition
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/30">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-purple-500/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Arcane. Embark on your mystical journey today.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-lg"
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
