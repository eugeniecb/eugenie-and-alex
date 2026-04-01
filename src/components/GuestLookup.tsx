'use client'

import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react'
import guestData from '@/data/guests.json'

type Tier = 'full-weekend' | 'wedding-only'

interface Guest {
  name: string
  tier: Tier
  searchTerms: string[]
}

interface Props {
  onSelect: (tier: Tier) => void
}

const CONTACT_EMAIL = 'eugenieandalex2026@gmail.com'
const guests = guestData.guests as Guest[]

/** Match query against the guest's pre-built searchTerms list. */
function fuzzyMatch(query: string, guest: Guest): boolean {
  const q = query.toLowerCase().trim()
  if (!q) return false
  return guest.searchTerms.some((term) => term.includes(q))
}

export default function GuestLookup({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Guest[]>([])
  const [selected, setSelected] = useState<Guest | null>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value)
    setSelected(null)
    setActiveIndex(-1)

    if (value.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    const matches = guests.filter((g) => fuzzyMatch(value, g))
    setResults(matches)
    setOpen(true)
  }

  function choose(guest: Guest) {
    setSelected(guest)
    setQuery(guest.name)
    setResults([])
    setOpen(false)
    onSelect(guest.tier)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      choose(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showNoResults = open && query.trim().length >= 2 && results.length === 0

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <p className="font-serif text-center text-lg leading-relaxed" style={{ color: '#722F37' }}>
        Find your name below to see your event details
      </p>

      <div ref={containerRef} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Your name"
          autoComplete="off"
          aria-label="Search for your name"
          aria-expanded={open}
          aria-autocomplete="list"
          className="w-full border-b-2 bg-transparent py-3 text-center font-serif text-xl placeholder:text-stone-300 outline-none transition-colors"
          style={{
            borderColor: selected ? '#C5A258' : '#722F37',
            color: '#722F37',
          }}
        />

        {/* Dropdown */}
        {open && results.length > 0 && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded border bg-white shadow-md"
            style={{ borderColor: '#e8d5c4' }}
          >
            {results.map((guest, i) => (
              <li
                key={guest.name}
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => { e.preventDefault(); choose(guest) }}
                className="cursor-pointer px-5 py-3 font-serif text-base transition-colors"
                style={{
                  backgroundColor: i === activeIndex ? '#FFF8F0' : 'white',
                  color: '#722F37',
                  borderBottom: i < results.length - 1 ? '1px solid #f0e6d9' : 'none',
                }}
              >
                {guest.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation */}
      {selected && (
        <p className="font-serif text-sm tracking-wide" style={{ color: '#C5A258' }}>
          Welcome, {selected.name.split(' ')[0]}! Scroll down to see your events.
        </p>
      )}

      {/* No results */}
      {showNoResults && (
        <p className="font-serif text-sm text-center leading-relaxed" style={{ color: '#722F37', opacity: 0.7 }}>
          Don&rsquo;t see your name?{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: '#722F37' }}
          >
            Please contact us
          </a>
          .
        </p>
      )}
    </div>
  )
}
