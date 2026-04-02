'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchResult {
  partyId: string
  displayName: string
  memberCount: number
}

interface Props {
  onPartySelected: (partyId: string) => void
}

export default function GuestLookup({ onPartySelected }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([])
      setSearched(false)
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/rsvp/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.parties ?? [])
      setSearched(true)
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); onPartySelected(results[activeIndex].partyId) }
    else if (e.key === 'Escape') setOpen(false)
  }

  const noResults = searched && !loading && results.length === 0 && query.trim().length >= 2

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div ref={containerRef} className="relative w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1) }}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Enter your first or last name"
            autoComplete="off"
            className="w-full border-b-2 bg-transparent py-3 pr-10 text-center font-serif text-xl placeholder:text-stone-300 outline-none transition-colors"
            style={{ borderColor: '#722F37', color: '#722F37' }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: '#C5A258' }}>
            {loading
              ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <Search size={16} strokeWidth={1.5} />
            }
          </div>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded border bg-white shadow-md"
              style={{ borderColor: '#e8d5c4' }}
            >
              {results.map((r, i) => (
                <li
                  key={r.partyId}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => { e.preventDefault(); onPartySelected(r.partyId) }}
                  className="cursor-pointer px-5 py-3 font-serif text-base transition-colors"
                  style={{
                    backgroundColor: i === activeIndex ? '#FFF8F0' : 'white',
                    color: '#722F37',
                    borderBottom: i < results.length - 1 ? '1px solid #f0e6d9' : 'none',
                  }}
                >
                  {r.displayName}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* No results message */}
      <AnimatePresence>
        {noResults && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-serif text-sm text-center leading-relaxed"
            style={{ color: '#722F37', opacity: 0.75 }}
          >
            We couldn&rsquo;t find that name. Try a different spelling, or{' '}
            <a
              href="mailto:eugenie.gruman@gmail.com"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              contact us
            </a>
            .
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
