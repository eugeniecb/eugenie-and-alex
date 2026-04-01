'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GuestLookup from '@/components/GuestLookup'

type Tier = 'full-weekend' | 'wedding-only'

interface Event {
  day: string
  date: string
  time: string
  title: string
  location: string
  description: string
  attire?: string
}

const WEDDING: Event = {
  day: 'Sunday',
  date: 'September 6, 2026',
  time: '5:00 PM – 1:00 AM',
  title: 'Wedding Celebration',
  location: 'Pavillon Ledoyen, Paris',
  description:
    'Please join us for our wedding ceremony and reception at the iconic Pavillon Ledoyen on the Champs-Élysées.',
  attire: 'Black tie',
}

const WELCOME_PARTY: Event = {
  day: 'Saturday',
  date: 'September 5, 2026',
  time: '7:00 PM',
  title: 'Welcome Party',
  location: 'Automobile Club de France\n6 place de la Concorde, Paris VIII',
  description:
    'Join us for an evening to kick off the weekend and celebrate with friends and family.',
  attire: 'Cocktail attire',
}

const FAREWELL_BRUNCH: Event = {
  day: 'Monday',
  date: 'September 7, 2026',
  time: '10:00 AM',
  title: 'Farewell Brunch',
  location: 'Laurent\n41 avenue Gabriel, Paris VIII',
  description:
    'One last morning together in Paris before we all head home. Jackets required for gentlemen; sneakers and jeans not permitted.',
  attire: 'Smart casual',
}

const eventsByTier: Record<Tier, Event[]> = {
  'wedding-only': [WEDDING],
  'full-weekend': [WELCOME_PARTY, WEDDING, FAREWELL_BRUNCH],
}

function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      key={event.title}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.12 }}
      className="w-full rounded-lg border bg-white px-8 py-8 font-serif space-y-4"
      style={{ borderColor: '#e8d5c4', color: '#722F37' }}
    >
      {/* Day / date */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs tracking-widest uppercase" style={{ color: '#C5A258' }}>
          {event.day}
        </p>
        <p className="text-sm tracking-wide" style={{ opacity: 0.7 }}>
          {event.date}
        </p>
      </div>

      {/* Gold divider */}
      <div className="mx-auto h-px w-12" style={{ backgroundColor: '#C5A258' }} />

      {/* Title */}
      <h3 className="text-center text-2xl sm:text-3xl" style={{ color: '#722F37' }}>
        {event.title}
      </h3>

      {/* Details */}
      <div className="text-center space-y-1 text-sm" style={{ opacity: 0.85 }}>
        <p className="tracking-wide">{event.time}</p>
        {event.location.split('\n').map((line) => (
          <p key={line} className="tracking-wide">{line}</p>
        ))}
        {event.attire && (
          <p className="tracking-widest uppercase text-xs pt-1" style={{ color: '#C5A258' }}>
            {event.attire}
          </p>
        )}
      </div>

      {/* Description */}
      <p className="text-center text-base leading-relaxed max-w-md mx-auto" style={{ opacity: 0.8 }}>
        {event.description}
      </p>
    </motion.div>
  )
}

export default function EventsPage() {
  const [tier, setTier] = useState<Tier | null>(null)

  return (
    <main style={{ backgroundColor: '#FFF8F0' }}>
      {/* ── Page header ── */}
      <section className="flex flex-col items-center gap-4 px-6 pt-16 pb-4 text-center">
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
          Events
        </motion.h1>
        <motion.div
          className="mx-auto h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </section>

      {/* ── Guest lookup ── */}
      <section className="px-6 py-12">
        <GuestLookup onSelect={setTier} />
      </section>

      {/* ── Events ── */}
      <AnimatePresence>
        {tier && (
          <motion.section
            key={tier}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-2xl px-6 pb-24 flex flex-col items-center gap-6"
          >
            <motion.p
              className="font-serif text-sm tracking-widest uppercase text-center"
              style={{ color: '#C5A258' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {tier === 'full-weekend'
                ? 'You are invited to the full weekend'
                : 'You are invited to the wedding celebration'}
            </motion.p>

            {eventsByTier[tier].map((event, i) => (
              <EventCard key={event.title} event={event} index={i} />
            ))}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}
