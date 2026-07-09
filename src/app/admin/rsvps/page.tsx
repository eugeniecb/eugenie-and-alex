'use client'

import { useState, useEffect, FormEvent } from 'react'
import { LogOut, RefreshCw, AlertCircle, Download } from 'lucide-react'

const ADMIN_SESSION_KEY = 'admin_token'

interface MemberRsvp {
  memberId: string
  firstName: string
  lastName: string
  attendingWelcomeParty: boolean | null
  attendingCeremony: boolean | null
  attendingReception: boolean | null
  attendingFarewellBrunch: boolean | null
  dietaryRestrictions: string
  updatedAt: string
}

interface PartyRsvp {
  partyId: string
  displayName: string
  members: MemberRsvp[]
}

interface NotRespondedMember {
  id: string
  firstName: string
  lastName: string
  isUnknownGuest: boolean
  events: { welcomeParty: boolean; ceremony: boolean; reception: boolean; farewellBrunch: boolean }
}

interface NotRespondedParty {
  partyId: string
  displayName: string
  members: NotRespondedMember[]
}

interface Stats {
  totalResponded: number
  totalNotResponded: number
  welcomeParty: number
  ceremony: number
  reception: number
  farewellBrunch: number
  dietary: number
}

function Dot({ attending }: { attending: boolean | null }) {
  if (attending === null) return <span style={{ color: '#d6d3d1' }}>—</span>
  return attending
    ? <span style={{ color: '#C5A258' }}>✓</span>
    : <span style={{ color: '#d6d3d1' }}>✗</span>
}

export default function AdminRsvpsPage() {
  const [token, setToken] = useState<string | null>(null)
  const [loginInput, setLoginInput] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [parties, setParties] = useState<PartyRsvp[]>([])
  const [notResponded, setNotResponded] = useState<NotRespondedParty[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'dietary' | 'not-responded'>('all')

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_SESSION_KEY)
    if (saved) setToken(saved)
  }, [])

  useEffect(() => {
    if (token) fetchRsvps(token)
  }, [token])

  async function fetchRsvps(t: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/rsvps', { headers: { 'x-admin-token': t } })
      if (res.status === 401) { logout(); return }
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setParties(data.parties)
      setNotResponded(data.notResponded)
      setStats(data.stats)
    } catch {
      setError('Could not load RSVPs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: loginInput }),
    })
    const { valid } = await res.json()
    if (valid) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, loginInput)
      setToken(loginInput)
    } else {
      setLoginError(true)
      setLoginInput('')
    }
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setToken(null)
  }

  function downloadCsv() {
    const header = ['Party', 'First Name', 'Last Name', 'Welcome Party', 'Ceremony', 'Reception', 'Farewell Brunch', 'Dietary Restrictions']
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
    const bool = (v: boolean | null) => v === null ? '' : v ? 'Yes' : 'No'
    const rows = parties.flatMap((party) =>
      party.members.map((m) => [
        escape(party.displayName),
        escape(m.firstName),
        escape(m.lastName),
        bool(m.attendingWelcomeParty),
        bool(m.attendingCeremony),
        bool(m.attendingReception),
        bool(m.attendingFarewellBrunch),
        escape(m.dietaryRestrictions),
      ].join(','))
    )
    const csv = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const displayed = filter === 'dietary'
    ? parties.filter((p) => p.members.some((m) => m.dietaryRestrictions))
    : parties

  // ── Login ─────────────────────────────────────────────────────────────────

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="flex flex-col items-center gap-6 border rounded-lg bg-white px-8 py-12 sm:px-12 sm:py-14 shadow-sm w-full max-w-sm" style={{ borderColor: '#e8d5c4' }}>
          <p className="font-serif text-2xl tracking-wide" style={{ color: '#722F37' }}>Admin Access</p>
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 w-full">
            <input
              type="password"
              value={loginInput}
              onChange={(e) => { setLoginInput(e.target.value); setLoginError(false) }}
              placeholder="Admin password"
              autoFocus
              className="w-full border-b-2 bg-transparent py-2 text-center font-serif outline-none"
              style={{ borderColor: loginError ? '#f87171' : '#722F37', color: '#722F37' }}
            />
            {loginError && <p className="font-serif text-xs text-red-400">Incorrect password.</p>}
            <button
              type="submit"
              className="w-full border py-2 font-serif text-sm tracking-widest uppercase hover:bg-stone-50"
              style={{ borderColor: '#722F37', color: '#722F37' }}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FFF8F0' }}>

      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shadow-sm" style={{ borderColor: '#e8d5c4' }}>
        <div>
          <p className="font-serif text-xl tracking-wide" style={{ color: '#722F37' }}>RSVPs</p>
          <p className="font-serif text-xs tracking-widest uppercase" style={{ color: '#C5A258' }}>
            {stats ? `${stats.totalResponded} ${stats.totalResponded === 1 ? 'party' : 'parties'} responded` : 'Loading…'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => fetchRsvps(token)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 font-serif text-sm border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-40"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={downloadCsv}
            disabled={parties.length === 0}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 font-serif text-sm border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-40"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Download </span>CSV
          </button>
          <a
            href="/admin"
            className="font-serif text-sm border border-stone-200 px-3 py-2 sm:px-4 text-stone-500 hover:bg-stone-50"
          >
            Site editor
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 font-serif text-sm border border-stone-200 text-stone-500 hover:bg-stone-50"
          >
            <LogOut size={13} />
            Log out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 space-y-8 sm:space-y-10">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Parties', value: stats.totalResponded },
              { label: 'Welcome Party', value: stats.welcomeParty },
              { label: 'Ceremony', value: stats.ceremony },
              { label: 'Reception', value: stats.reception },
              { label: 'Farewell Brunch', value: stats.farewellBrunch },
              { label: 'Dietary notes', value: stats.dietary },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border bg-white px-4 py-4 text-center"
                style={{ borderColor: '#e8d5c4' }}
              >
                <p className="font-serif text-2xl font-semibold" style={{ color: '#722F37' }}>{value}</p>
                <p className="font-serif text-xs tracking-wide mt-1" style={{ color: '#C5A258' }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 font-serif text-sm text-red-500 bg-red-50 border border-red-200 rounded px-4 py-3">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {(['all', 'dietary', 'not-responded'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-serif text-xs tracking-widest uppercase border px-4 py-1.5 transition-colors"
              style={{
                borderColor: filter === f ? '#722F37' : '#e8d5c4',
                color: filter === f ? '#722F37' : '#a8a29e',
                backgroundColor: filter === f ? '#fdf2f2' : 'transparent',
              }}
            >
              {f === 'all'
                ? `All (${parties.length})`
                : f === 'dietary'
                ? `Dietary notes (${parties.filter(p => p.members.some(m => m.dietaryRestrictions)).length})`
                : `Not RSVP'd (${notResponded.length})`}
            </button>
          ))}
        </div>

        {/* RSVP list */}
        {loading && !parties.length && !notResponded.length ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
          </div>
        ) : filter === 'not-responded' ? (
          notResponded.length === 0 ? (
            <p className="font-serif text-center text-stone-400 py-12">Everyone has RSVP&apos;d!</p>
          ) : (
            <div className="space-y-4">
              {notResponded.map((party) => (
                <div
                  key={party.partyId}
                  className="rounded-lg border bg-white overflow-hidden"
                  style={{ borderColor: '#e8d5c4' }}
                >
                  <div className="px-4 py-3 sm:px-6" style={{ backgroundColor: '#fffaf6' }}>
                    <p className="font-serif text-base" style={{ color: '#722F37' }}>{party.displayName}</p>
                  </div>
                  <div className="px-4 py-3 sm:px-6 space-y-2">
                    {party.members.map((member) => (
                      <div key={member.id} className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-serif text-sm" style={{ color: '#722F37' }}>
                          {member.firstName} {member.lastName}
                        </p>
                        <div className="flex gap-2">
                          {([
                            ['Welcome', member.events.welcomeParty],
                            ['Ceremony', member.events.ceremony],
                            ['Reception', member.events.reception],
                            ['Brunch', member.events.farewellBrunch],
                          ] as const)
                            .filter(([, invited]) => invited)
                            .map(([label]) => (
                              <span
                                key={label}
                                className="font-serif text-xs tracking-wide uppercase px-2 py-0.5 rounded-full"
                                style={{ color: '#C5A258', backgroundColor: '#fdf6ec' }}
                              >
                                {label}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : displayed.length === 0 ? (
          <p className="font-serif text-center text-stone-400 py-12">No RSVPs yet.</p>
        ) : (
          <div className="space-y-4">
            {displayed.map((party) => (
              <div
                key={party.partyId}
                className="rounded-lg border bg-white overflow-hidden"
                style={{ borderColor: '#e8d5c4' }}
              >
                {/* Party header */}
                <div className="px-4 py-3 sm:px-6 border-b flex items-center justify-between gap-3" style={{ borderColor: '#e8d5c4', backgroundColor: '#fffaf6' }}>
                  <p className="font-serif text-base" style={{ color: '#722F37' }}>{party.displayName}</p>
                  <p className="font-serif text-xs text-stone-400 shrink-0">
                    {new Date(party.members[0]?.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {/* Members — table on larger screens */}
                <table className="hidden sm:table w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#f0e6d9' }}>
                      <th className="text-left px-6 py-2 font-serif text-xs text-stone-400 tracking-widest uppercase font-normal">Name</th>
                      <th className="text-center px-3 py-2 font-serif text-xs text-stone-400 tracking-widest uppercase font-normal">Welcome</th>
                      <th className="text-center px-3 py-2 font-serif text-xs text-stone-400 tracking-widest uppercase font-normal">Ceremony</th>
                      <th className="text-center px-3 py-2 font-serif text-xs text-stone-400 tracking-widest uppercase font-normal">Reception</th>
                      <th className="text-center px-3 py-2 font-serif text-xs text-stone-400 tracking-widest uppercase font-normal">Brunch</th>
                      <th className="text-left px-6 py-2 font-serif text-xs text-stone-400 tracking-widest uppercase font-normal">Dietary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {party.members.map((member, i) => (
                      <tr
                        key={member.memberId}
                        style={{ borderTop: i > 0 ? '1px solid #f9f0e8' : 'none' }}
                      >
                        <td className="px-6 py-3 font-serif text-sm" style={{ color: '#722F37' }}>
                          {member.firstName} {member.lastName}
                        </td>
                        <td className="text-center px-3 py-3 font-serif text-base"><Dot attending={member.attendingWelcomeParty} /></td>
                        <td className="text-center px-3 py-3 font-serif text-base"><Dot attending={member.attendingCeremony} /></td>
                        <td className="text-center px-3 py-3 font-serif text-base"><Dot attending={member.attendingReception} /></td>
                        <td className="text-center px-3 py-3 font-serif text-base"><Dot attending={member.attendingFarewellBrunch} /></td>
                        <td className="px-6 py-3 font-serif text-sm text-stone-500">
                          {member.dietaryRestrictions || <span className="text-stone-300">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Members — stacked cards on mobile */}
                <div className="sm:hidden">
                  {party.members.map((member, i) => (
                    <div
                      key={member.memberId}
                      className="px-4 py-4 space-y-3"
                      style={{ borderTop: i > 0 ? '1px solid #f9f0e8' : 'none' }}
                    >
                      <p className="font-serif text-sm" style={{ color: '#722F37' }}>
                        {member.firstName} {member.lastName}
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {([
                          ['Welcome', member.attendingWelcomeParty],
                          ['Ceremony', member.attendingCeremony],
                          ['Reception', member.attendingReception],
                          ['Brunch', member.attendingFarewellBrunch],
                        ] as const).map(([label, attending]) => (
                          <div key={label} className="flex items-center justify-between border-b pb-1" style={{ borderColor: '#f9f0e8' }}>
                            <span className="font-serif text-xs tracking-wide uppercase text-stone-400">{label}</span>
                            <span className="font-serif text-base"><Dot attending={attending} /></span>
                          </div>
                        ))}
                      </div>
                      {member.dietaryRestrictions && (
                        <p className="font-serif text-sm text-stone-500">
                          <span className="text-xs tracking-wide uppercase text-stone-400">Dietary · </span>
                          {member.dietaryRestrictions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
