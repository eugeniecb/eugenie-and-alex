'use client'

import { useState, useEffect, FormEvent } from 'react'
import { usePathname } from 'next/navigation'

const SESSION_KEY = 'wedding_unlocked'

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [unlocked, setUnlocked] = useState<boolean | null>(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === 'true')
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (input === process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  // Admin has its own auth — bypass guest password gate
  if (pathname.startsWith('/admin')) return <>{children}</>

  // Avoid flash before sessionStorage is read
  if (unlocked === null) return null

  if (unlocked) return <>{children}</>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 rounded-lg border border-stone-200 bg-white px-12 py-14 shadow-sm">
        <p className="font-serif text-3xl tracking-wide text-stone-700">
          Eugenie &amp; Alex
        </p>
        <p className="font-serif text-sm tracking-widest text-stone-400 uppercase">
          Please enter the password to continue
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-64">
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            className={[
              'w-full border-b bg-transparent py-2 text-center font-serif text-stone-700',
              'placeholder:text-stone-300 outline-none transition-colors',
              error ? 'border-rose-400' : 'border-stone-300 focus:border-stone-500',
            ].join(' ')}
          />
          {error && (
            <p className="font-serif text-xs text-rose-400">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            className="mt-2 w-full border border-stone-300 py-2 font-serif text-sm tracking-widest text-stone-600 uppercase transition-colors hover:bg-stone-50"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
