'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SESSION_KEY = 'wedding_guest'

export default function RsvpPage() {
  const [guestName, setGuestName] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const guest = JSON.parse(saved)
        if (guest?.name) setGuestName(guest.name)
      }
    } catch {}
  }, [])

  const href = guestName
    ? `https://www.zola.com/wedding/eugenieandalex/rsvp?name=${encodeURIComponent(guestName)}`
    : 'https://www.zola.com/wedding/eugenieandalex/rsvp'

  return (
    <main style={{ backgroundColor: '#FFF8F0' }}>
      <section className="flex flex-col items-center gap-4 px-6 pt-16 pb-24 text-center">
        <motion.div
          className="mx-auto h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.h1
          className="script text-5xl sm:text-6xl"
          style={{ color: '#722F37' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          RSVP
        </motion.h1>
        <motion.div
          className="mx-auto h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        <motion.p
          className="max-w-sm font-serif text-base sm:text-lg leading-relaxed pt-4"
          style={{ color: '#722F37', opacity: 0.85 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Kindly reply by <span className="font-semibold">July 15, 2026</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="pt-4"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border px-12 py-4 font-serif text-sm tracking-widest uppercase transition-colors hover:bg-white"
            style={{ borderColor: '#722F37', color: '#722F37' }}
          >
            RSVP
          </a>
        </motion.div>
      </section>
    </main>
  )
}
