'use client'

import { motion } from 'framer-motion'
import EventToggle from './EventToggle'
import { EVENTS } from '@/data/events'
import type { PartyWithRsvp, MemberResponse, EventKey } from '@/types/rsvp'

interface Props {
  party: PartyWithRsvp
  nameUpdates: Record<string, { newFirstName: string; newLastName: string }>
  declinedGuests: Set<string>
  responses: Record<string, MemberResponse>
  onResponsesChange: (responses: Record<string, MemberResponse>) => void
  onBack: () => void
  onContinue: () => void
}

const EVENT_ORDER: EventKey[] = ['welcomeParty', 'ceremony', 'reception', 'farewellBrunch']

export default function EventAttendance({ party, nameUpdates, declinedGuests, responses, onResponsesChange, onBack, onContinue }: Props) {

  function getMemberName(memberId: string, firstName: string, lastName: string) {
    const update = nameUpdates[memberId]
    if (update) return `${update.newFirstName} ${update.newLastName ?? ''}`.trim()
    return `${firstName} ${lastName}`.trim()
  }

  function updateResponse(memberId: string, field: keyof MemberResponse, value: boolean | string | null) {
    const current = responses[memberId]
    const updated = { ...current, [field]: value }

    // Link ceremony ↔ reception
    if (field === 'attendingCeremony') {
      updated.attendingReception = value as boolean | null
    }

    onResponsesChange({ ...responses, [memberId]: updated })
  }

  function validate(): boolean {
    for (const member of party.members) {
      const r = responses[member.id]
      for (const key of EVENT_ORDER) {
        if (!member.events[key]) continue
        const fieldMap: Record<EventKey, keyof MemberResponse> = {
          welcomeParty: 'attendingWelcomeParty',
          ceremony: 'attendingCeremony',
          reception: 'attendingReception',
          farewellBrunch: 'attendingFarewellBrunch',
        }
        if (r[fieldMap[key]] === null) return false
      }
    }
    return true
  }

  function handleContinue() {
    if (validate()) {
      onContinue()
    } else {
      // Scroll to first unanswered — just alert for now
      alert('Please select a response for every event before continuing.')
    }
  }

  const activeMembers = party.members.filter((m) => !declinedGuests.has(m.id))

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {activeMembers.map((member, mi) => {
        const r = responses[member.id]
        const name = getMemberName(member.id, member.firstName, member.lastName)
        const invitedEvents = EVENT_ORDER.filter((k) => member.events[k])

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mi * 0.08 }}
            className="rounded-lg border bg-white overflow-hidden"
            style={{ borderColor: '#e8d5c4' }}
          >
            {/* Member header */}
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: '#e8d5c4', backgroundColor: '#fffaf6' }}
            >
              <p className="font-serif text-lg" style={{ color: '#722F37' }}>{name}</p>
            </div>

            <div className="px-6 py-5 space-y-6">
              {invitedEvents.map((eventKey) => {
                const event = EVENTS[eventKey]
                const fieldMap: Record<EventKey, keyof MemberResponse> = {
                  welcomeParty: 'attendingWelcomeParty',
                  ceremony: 'attendingCeremony',
                  reception: 'attendingReception',
                  farewellBrunch: 'attendingFarewellBrunch',
                }
                const field = fieldMap[eventKey]
                const value = r[field] as boolean | null
                const isReceptionLinked = eventKey === 'reception'

                return (
                  <div key={eventKey} className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-base font-semibold" style={{ color: '#722F37' }}>
                          {event.name}
                        </p>
                        <p className="font-serif text-xs" style={{ color: '#722F37', opacity: 0.65 }}>
                          {event.date} · {event.time}
                        </p>
                        {isReceptionLinked && (
                          <p className="font-serif text-xs italic mt-0.5" style={{ color: '#C5A258' }}>
                            The reception immediately follows the ceremony
                          </p>
                        )}
                      </div>
                    </div>
                    <EventToggle
                      value={value}
                      onChange={(v) => updateResponse(member.id, field, v)}
                      disabled={isReceptionLinked}
                    />
                    {isReceptionLinked && (
                      <p className="font-serif text-xs" style={{ color: '#9ca3af' }}>
                        Set automatically based on your ceremony response
                      </p>
                    )}
                  </div>
                )
              })}

              {/* Dietary */}
              <div className="pt-2 border-t" style={{ borderColor: '#f0e6d9' }}>
                <label className="block font-serif text-xs text-stone-400 tracking-widest uppercase mb-2">
                  Dietary restrictions or allergies
                </label>
                <textarea
                  value={r.dietaryRestrictions}
                  onChange={(e) => updateResponse(member.id, 'dietaryRestrictions', e.target.value)}
                  placeholder="e.g. vegetarian, nut allergy, kosher"
                  rows={2}
                  className="w-full border-b bg-transparent font-serif text-sm outline-none resize-none placeholder:text-stone-300"
                  style={{ borderColor: '#e8d5c4', color: '#722F37' }}
                />
              </div>
            </div>
          </motion.div>
        )
      })}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border py-3.5 font-serif text-sm tracking-widest uppercase transition-colors hover:bg-stone-50"
          style={{ borderColor: '#e8d5c4', color: '#9c7b7b' }}
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-[2] border py-3.5 font-serif text-sm tracking-widest uppercase transition-colors hover:bg-white"
          style={{ borderColor: '#722F37', color: '#722F37' }}
        >
          Review &amp; Submit
        </button>
      </div>
    </div>
  )
}
