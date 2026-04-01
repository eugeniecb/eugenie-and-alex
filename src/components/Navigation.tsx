'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/',         label: 'Home' },
  { href: '/events',   label: 'Events' },
  { href: '/travel',   label: 'Travel' },
  { href: '/gallery',  label: 'Gallery' },
  { href: '/registry', label: 'Registry' },
  { href: '/rsvp',     label: 'RSVP' },
  { href: '/faq',      label: 'FAQ' },
]

const burgundy = '#722F37'

export default function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="w-full bg-white border-b border-stone-100 sticky top-0 z-40"
      style={{ color: burgundy }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl tracking-wide"
          style={{ color: burgundy }}
        >
          Eugénie &amp; Alex
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="font-serif text-sm tracking-widest uppercase transition-opacity hover:opacity-70"
                  style={{
                    color: burgundy,
                    borderBottom: active ? `1px solid ${burgundy}` : 'none',
                    paddingBottom: active ? '2px' : '3px',
                  }}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1"
          style={{ color: burgundy }}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden flex flex-col border-t border-stone-100 bg-white">
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 font-serif text-sm tracking-widest uppercase transition-colors hover:bg-stone-50"
                  style={{
                    color: burgundy,
                    borderLeft: active ? `3px solid ${burgundy}` : '3px solid transparent',
                  }}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
