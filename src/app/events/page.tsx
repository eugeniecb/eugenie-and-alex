'use client'

import { useState, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import guestData from '@/data/guests.json'

type Tier = 'full-weekend' | 'wedding-only'
interface Guest { name: string; tier: Tier; searchTerms: string[] }

const SESSION_KEY = 'wedding_guest'
const guests = guestData.guests as Guest[]

function match(query: string, guest: Guest): boolean {
  const q = query.toLowerCase().trim()
  if (!q) return false
  return guest.searchTerms.some((term) => term.includes(q))
}

// ── Event data ─────────────────────────────────────────────────────────────

interface Event {
  day: string
  date: string
  time: string
  title: string
  location: string
  address: string
  description: string
  attire: string
}

const WELCOME_PARTY: Event = {
  day: 'Saturday',
  date: 'September 5, 2026',
  time: '7:00 PM',
  title: 'Welcome Party',
  location: 'Automobile Club de France',
  address: '6 place de la Concorde, Paris VIII',
  description: 'Join us for an evening to kick off the weekend.',
  attire: 'Cocktail attire',
}

const WEDDING: Event = {
  day: 'Sunday',
  date: 'September 6, 2026',
  time: '5:00 PM – 1:00 AM',
  title: 'Wedding Celebration',
  location: 'Pavillon Ledoyen',
  address: 'Carré des Champs-Élysées, Paris VIII',
  description: 'Please join us for our wedding ceremony and reception.',
  attire: 'Black tie',
}

const FAREWELL_BRUNCH: Event = {
  day: 'Monday',
  date: 'September 7, 2026',
  time: '10:00 AM',
  title: 'Farewell Brunch',
  location: 'Laurent',
  address: '41 avenue Gabriel, Paris VIII',
  description: 'One last morning together in Paris. Jackets required for gentlemen; sneakers and jeans not permitted.',
  attire: 'Smart casual',
}

const eventsByTier: Record<Tier, Event[]> = {
  'full-weekend':  [WELCOME_PARTY, WEDDING, FAREWELL_BRUNCH],
  'wedding-only':  [WEDDING],
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="mx-auto h-px w-16" style={{ backgroundColor: '#C5A258' }} />
  )
}

function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.12 }}
      className="w-full rounded-lg border bg-white px-8 py-8 font-serif text-center space-y-3"
      style={{ borderColor: '#e8d5c4', color: '#722F37' }}
    >
      <p className="text-xs tracking-widest uppercase" style={{ color: '#C5A258' }}>
        {event.day}
      </p>
      <p className="text-sm tracking-wide" style={{ opacity: 0.65 }}>
        {event.date}
      </p>
      <div className="mx-auto h-px w-10" style={{ backgroundColor: '#C5A258' }} />
      <h3 className="text-2xl sm:text-3xl">{event.title}</h3>
      <div className="text-sm space-y-0.5" style={{ opacity: 0.8 }}>
        <p className="font-semibold">{event.location}</p>
        <p>{event.address}</p>
        <p>{event.time}</p>
      </div>
      <p className="text-xs tracking-widest uppercase pt-1" style={{ color: '#C5A258' }}>
        {event.attire}
      </p>
      <p className="text-sm leading-relaxed max-w-sm mx-auto pt-1" style={{ opacity: 0.75 }}>
        {event.description}
      </p>
    </motion.div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [lockedGuest, setLockedGuest] = useState<Guest | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Guest[]>([])
  const [searched, setSearched] = useState(false)

  // Restore locked guest from session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) setLockedGuest(JSON.parse(saved) as Guest)
    } catch {}
    setHydrated(true)
  }, [])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (query.trim().length < 2) return
    setResults(guests.filter((g) => match(query, g)))
    setSearched(true)
  }

  function handleSelect(guest: Guest) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(guest))
    setLockedGuest(guest)
  }

  // Avoid flash before sessionStorage is read
  if (!hydrated) return null

  const events = lockedGuest ? eventsByTier[lockedGuest.tier] : null

  return (
    <main style={{ backgroundColor: '#FFF8F0' }}>
      {/* Page header */}
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

      <AnimatePresence mode="wait">

        {/* ── Search state ── */}
        {!lockedGuest && (
          <motion.section
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-8 px-6 py-12"
          >
            <p className="font-serif text-center text-lg leading-relaxed max-w-sm" style={{ color: '#722F37' }}>
              Enter your name to see your event details
            </p>

            {/* Search form */}
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-sm flex-col items-center gap-4"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearched(false); setResults([]) }}
                placeholder="First and last name"
                autoComplete="off"
                className="w-full border-b-2 bg-transparent py-3 text-center font-serif text-xl placeholder:text-stone-300 outline-none transition-colors"
                style={{ borderColor: '#722F37', color: '#722F37' }}
              />
              <button
                type="submit"
                className="flex items-center gap-2 border px-10 py-3 font-serif text-sm tracking-widest uppercase transition-colors hover:bg-white"
                style={{ borderColor: '#722F37', color: '#722F37' }}
              >
                <Search size={14} strokeWidth={1.5} />
                Search
              </button>
            </form>

            {/* Results */}
            {searched && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm flex flex-col gap-2"
              >
                <p className="font-serif text-xs tracking-widest uppercase text-center pb-1" style={{ color: '#C5A258' }}>
                  Select your name
                </p>
                {results.map((guest) => (
                  <button
                    key={guest.name}
                    onClick={() => handleSelect(guest)}
                    className="w-full border bg-white py-3 px-6 font-serif text-base transition-colors hover:bg-stone-50 text-center"
                    style={{ borderColor: '#e8d5c4', color: '#722F37' }}
                  >
                    {guest.name}
                  </button>
                ))}
              </motion.div>
            )}

            {/* No results */}
            {searched && results.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-serif text-sm text-center leading-relaxed"
                style={{ color: '#722F37', opacity: 0.7 }}
              >
                We couldn&rsquo;t find that name.{' '}
                <a
                  href="mailto:eugenieandalex2026@gmail.com"
                  className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  style={{ color: '#722F37' }}
                >
                  Please contact us
                </a>{' '}
                and we&rsquo;ll help you out.
              </motion.p>
            )}
          </motion.section>
        )}

        {/* ── Locked: show events ── */}
        {lockedGuest && events && (
          <motion.section
            key="events"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl px-6 py-12 pb-24 flex flex-col items-center gap-6"
          >
            <p className="font-serif text-center text-lg" style={{ color: '#722F37' }}>
              Welcome, <span className="italic">{lockedGuest.name.split(' ')[0]}</span>
            </p>
            <Divider />
            {events.map((event, i) => (
              <EventCard key={event.title} event={event} index={i} />
            ))}
          </motion.section>
        )}

      </AnimatePresence>
    </main>
  )
}
