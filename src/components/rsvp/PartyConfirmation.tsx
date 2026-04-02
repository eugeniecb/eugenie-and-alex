'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { PartyWithRsvp } from '@/types/rsvp'

interface Props {
  party: PartyWithRsvp
  nameUpdates: Record<string, { newFirstName: string; newLastName: string }>
  declinedGuests: Set<string>
  onNameUpdatesChange: (updates: Record<string, { newFirstName: string; newLastName: string }>) => void
  onDeclinedGuestsChange: (declined: Set<string>) => void
  onContinue: () => void
}

export default function PartyConfirmation({
  party, nameUpdates, declinedGuests,
  onNameUpdatesChange, onDeclinedGuestsChange, onContinue,
}: Props) {
  const [editing, setEditing] = useState<string | null>(null)
  const [draftFirst, setDraftFirst] = useState('')
  const [draftLast, setDraftLast] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Merge DB name updates (pre-fill from prior submission)
  const allUpdates = { ...nameUpdates }
  for (const nu of party.nameUpdates) {
    if (!allUpdates[nu.memberId]) {
      allUpdates[nu.memberId] = { newFirstName: nu.newFirstName, newLastName: nu.newLastName ?? '' }
    }
  }

  function getMemberDisplayName(memberId: string, firstName: string, lastName: string, isUnknown: boolean) {
    const update = allUpdates[memberId]
    if (update) return `${update.newFirstName} ${update.newLastName ?? ''}`.trim()
    if (isUnknown) return null
    return `${firstName} ${lastName}`.trim()
  }

  function startEditing(memberId: string) {
    const current = allUpdates[memberId]
    setDraftFirst(current?.newFirstName ?? '')
    setDraftLast(current?.newLastName ?? '')
    setEditing(memberId)
  }

  function saveName(memberId: string) {
    if (!draftFirst.trim()) {
      setErrors((e) => ({ ...e, [memberId]: 'First name is required' }))
      return
    }
    // If they were previously declined, un-decline when they add a name
    const newDeclined = new Set(declinedGuests)
    newDeclined.delete(memberId)
    onDeclinedGuestsChange(newDeclined)
    onNameUpdatesChange({ ...allUpdates, [memberId]: { newFirstName: draftFirst.trim(), newLastName: draftLast.trim() } })
    setEditing(null)
    setErrors((e) => { const n = { ...e }; delete n[memberId]; return n })
  }

  function decline(memberId: string) {
    const newDeclined = new Set(declinedGuests)
    newDeclined.add(memberId)
    onDeclinedGuestsChange(newDeclined)
    setErrors((e) => { const n = { ...e }; delete n[memberId]; return n })
  }

  function undecline(memberId: string) {
    const newDeclined = new Set(declinedGuests)
    newDeclined.delete(memberId)
    onDeclinedGuestsChange(newDeclined)
  }

  function validate() {
    const newErrors: Record<string, string> = {}
    for (const m of party.members) {
      if (m.isUnknownGuest && !allUpdates[m.id] && !declinedGuests.has(m.id)) {
        newErrors[m.id] = 'Please add your guest\'s name or indicate you\'re not bringing one'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      {party.hasExistingRsvp && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded border px-5 py-3 font-serif text-sm text-center leading-relaxed"
          style={{ borderColor: '#C5A258', color: '#722F37', backgroundColor: '#fffbf0' }}
        >
          It looks like your party has already responded. You can review and update your RSVP below.
        </motion.div>
      )}

      <div className="space-y-3">
        {party.members.map((member, i) => {
          const displayName = getMemberDisplayName(member.id, member.firstName, member.lastName, member.isUnknownGuest)
          const isDeclined = declinedGuests.has(member.id)
          const needsDecision = member.isUnknownGuest && !allUpdates[member.id] && !isDeclined
          const isEditing = editing === member.id

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-lg border bg-white px-6 py-5"
              style={{ borderColor: errors[member.id] ? '#f87171' : '#e8d5c4' }}
            >
              {isEditing ? (
                /* ── Editing name ── */
                <div className="space-y-3">
                  <p className="font-serif text-sm text-stone-600 tracking-widest uppercase">Guest name</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={draftFirst}
                      onChange={(e) => setDraftFirst(e.target.value)}
                      placeholder="First name *"
                      autoFocus
                      className="flex-1 border-b bg-transparent py-1.5 font-serif text-base outline-none"
                      style={{ borderColor: '#722F37', color: '#722F37' }}
                    />
                    <input
                      type="text"
                      value={draftLast}
                      onChange={(e) => setDraftLast(e.target.value)}
                      placeholder="Last name"
                      className="flex-1 border-b bg-transparent py-1.5 font-serif text-base outline-none"
                      style={{ borderColor: '#722F37', color: '#722F37' }}
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => saveName(member.id)}
                      className="font-serif text-xs tracking-widest uppercase border px-4 py-1.5 transition-colors hover:bg-stone-50"
                      style={{ borderColor: '#722F37', color: '#722F37' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="font-serif text-xs tracking-widest uppercase text-stone-400 hover:text-stone-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              ) : isDeclined ? (
                /* ── Declined bringing guest ── */
                <div className="flex items-center justify-between">
                  <p className="font-serif text-base italic" style={{ color: '#722F37', opacity: 0.55 }}>
                    Not bringing a guest
                  </p>
                  <button
                    onClick={() => undecline(member.id)}
                    className="font-serif text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2"
                  >
                    Undo
                  </button>
                </div>

              ) : needsDecision ? (
                /* ── Unknown guest, needs decision ── */
                <div className="space-y-3">
                  <p className="font-serif text-base" style={{ color: '#722F37', opacity: 0.65 }}>
                    You have a guest whose name we don&rsquo;t have yet.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => startEditing(member.id)}
                      className="font-serif text-sm tracking-widest uppercase border px-4 py-2 transition-colors hover:bg-stone-50"
                      style={{ borderColor: '#722F37', color: '#722F37' }}
                    >
                      Add guest name
                    </button>
                    <button
                      onClick={() => decline(member.id)}
                      className="font-serif text-sm tracking-widest uppercase border px-4 py-2 transition-colors hover:bg-stone-50"
                      style={{ borderColor: '#e8d5c4', color: '#9c7b7b' }}
                    >
                      Not bringing a guest
                    </button>
                  </div>
                  {errors[member.id] && (
                    <p className="font-serif text-sm text-red-400">{errors[member.id]}</p>
                  )}
                </div>

              ) : (
                /* ── Named member ── */
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg" style={{ color: '#722F37' }}>{displayName}</p>
                  {member.isUnknownGuest && (
                    <button
                      onClick={() => startEditing(member.id)}
                      className="font-serif text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2"
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <button
        onClick={() => { if (validate()) onContinue() }}
        className="w-full border py-4 font-serif text-base tracking-widest uppercase transition-colors hover:bg-white mt-2"
        style={{ borderColor: '#722F37', color: '#722F37' }}
      >
        Continue
      </button>
    </div>
  )
}
