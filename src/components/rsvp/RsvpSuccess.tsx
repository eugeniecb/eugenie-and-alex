'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

const COLORS = ['#722F37', '#C5A258', '#E8A0BF', '#6B8E23', '#FFFDF9']

export default function RsvpSuccess({ firstName }: { firstName: string }) {
  useEffect(() => {
    const isMobile = window.innerWidth < 640
    const count = isMobile ? 50 : 80

    confetti({
      particleCount: count,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: COLORS,
      gravity: 0.8,
      drift: 0.5,
      ticks: 200,
      shapes: ['circle', 'square'],
    })

    confetti({
      particleCount: count,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: COLORS,
      gravity: 0.8,
      drift: -0.5,
      ticks: 200,
      shapes: ['circle', 'square'],
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center gap-6 text-center max-w-md mx-auto py-8"
    >
      {/* Animated gold divider */}
      <motion.div
        className="h-px w-16"
        style={{ backgroundColor: '#C5A258' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      />

      <motion.h2
        className="script text-5xl"
        style={{ color: '#722F37' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        Merci, {firstName}!
      </motion.h2>

      <motion.div
        className="h-px w-16"
        style={{ backgroundColor: '#C5A258' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      />

      <motion.p
        className="font-serif text-lg leading-relaxed"
        style={{ color: '#722F37', opacity: 0.85 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        We can&rsquo;t wait to celebrate with you in Paris.
      </motion.p>

      <motion.p
        className="font-serif text-sm leading-relaxed"
        style={{ color: '#722F37', opacity: 0.6 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
      >
        If you need to make any changes, you can always come back and resubmit.
      </motion.p>
    </motion.div>
  )
}
