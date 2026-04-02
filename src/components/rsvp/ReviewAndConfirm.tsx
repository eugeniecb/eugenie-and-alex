'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { EVENTS } from '@/data/events'
import type { PartyWithRsvp, MemberResponse, EventKey } from '@/types/rsvp'

interface Props {
  party: PartyWithRsvp
  nameUpdates: Record<string, { newFirstName: string; newLastName: string }>
  responses: Record<string, MemberResponse>
  onBack: () => void
  onSuccess: () => void
}

const EVENT_ORDER: EventKey[] = ['welcomeParty', 'ceremony', 'reception', 'farewellBrunch']

const fieldMap: Record<EventKey, keyof MemberResponse> = {
  welcomeParty: 'attendingWelcomeParty',
  ceremony: 'attendingCeremony',
  reception: 'attendingReception',
  farewellBrunch: 'attendingFarewellBrunch',
}

export default function ReviewAndConfirm({ party, nameUpdates, responses, onBack, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function getMemberName(memberId: string, firstName: string, lastName: string) {
    const update = nameUpdates[memberId]
    if (update) return `${update.newFirstName} ${update.newLastName ?? ''}`.trim()
    return `${firstName} ${lastName}`.trim()
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)

    const guestNameUpdates = Object.entries(nameUpdates).map(([memberId, u]) => ({
      memberId,
      newFirstName: u.newFirstName,
      newLastName: u.newLastName,
    }))

    try {
      const res = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partyId: party.partyId,
          responses: Object.values(responses),
          guestNameUpdates,
        }),
      })

      if (res.ok) {
        onSuccess()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {party.members.map((member, mi) => {
        const r = responses[member.id]
        const name = getMemberName(member.id, member.firstName, member.lastName)
        const invitedEvents = EVENT_ORDER.filter((k) => member.events[k])

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mi * 0.07 }}
            className="rounded-lg border bg-white overflow-hidden"
            style={{ borderColor: '#e8d5c4' }}
          >
            <div className="px-6 py-4 border-b" style={{ borderColor: '#e8d5c4', backgroundColor: '#fffaf6' }}>
              <p className="font-serif text-xl" style={{ color: '#722F37' }}>{name}</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              {invitedEvents.map((eventKey) => {
                const event = EVENTS[eventKey]
                const attending = r[fieldMap[eventKey]] as boolean | null
                return (
                  <div key={eventKey} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-serif text-lg" style={{ color: '#722F37' }}>{event.name}</p>
                      <p className="font-serif text-base" style={{ color: '#722F37', opacity: 0.55 }}>
                        {event.date}
                      </p>
                    </div>
                    <span
                      className="font-serif text-base tracking-wide whitespace-nowrap"
                      style={{ color: attending ? '#C5A258' : '#9ca3af' }}
                    >
                      {attending ? 'Attending' : 'Not attending'}
                    </span>
                  </div>
                )
              })}
              {r.dietaryRestrictions && (
                <div className="pt-2 border-t" style={{ borderColor: '#f0e6d9' }}>
                  <p className="font-serif text-base text-stone-600 tracking-widest uppercase mb-1">Dietary notes</p>
                  <p className="font-serif text-lg" style={{ color: '#722F37', opacity: 0.8 }}>
                    {r.dietaryRestrictions}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded border px-5 py-3 font-serif text-base text-center"
          style={{ borderColor: '#f87171', color: '#ef4444', backgroundColor: '#fff5f5' }}
        >
          {error}
        </motion.div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 border py-3.5 font-serif text-base tracking-widest uppercase transition-colors hover:bg-stone-50 disabled:opacity-40"
          style={{ borderColor: '#e8d5c4', color: '#9c7b7b' }}
        >
          Edit
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-[2] border py-3.5 font-serif text-base tracking-widest uppercase transition-colors hover:bg-white disabled:opacity-40"
          style={{ borderColor: '#722F37', color: '#722F37' }}
        >
          {submitting ? 'Submitting…' : 'Submit RSVP'}
        </button>
      </div>
    </div>
  )
}
