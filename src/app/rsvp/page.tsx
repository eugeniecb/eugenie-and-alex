'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GuestLookup from '@/components/rsvp/GuestLookup'
import PartyConfirmation from '@/components/rsvp/PartyConfirmation'
import EventAttendance from '@/components/rsvp/EventAttendance'
import ReviewAndConfirm from '@/components/rsvp/ReviewAndConfirm'
import RsvpSuccess from '@/components/rsvp/RsvpSuccess'
import StepIndicator from '@/components/rsvp/StepIndicator'
import { partyGreetingName } from '@/lib/search'
import type { PartyWithRsvp, MemberResponse, EventKey } from '@/types/rsvp'

type Step = 1 | 2 | 3 | 4 | 'success'

const RSVP_DEADLINE = new Date('2026-07-15T23:59:59')
const EVENT_ORDER: EventKey[] = ['welcomeParty', 'ceremony', 'reception', 'farewellBrunch']
const fieldMap: Record<EventKey, keyof MemberResponse> = {
  welcomeParty: 'attendingWelcomeParty',
  ceremony: 'attendingCeremony',
  reception: 'attendingReception',
  farewellBrunch: 'attendingFarewellBrunch',
}

function buildInitialResponses(
  party: PartyWithRsvp,
  nameUpdates: Record<string, { newFirstName: string; newLastName: string }>
): Record<string, MemberResponse> {
  const map: Record<string, MemberResponse> = {}
  for (const member of party.members) {
    const existing = party.existingResponses.find((r) => r.memberId === member.id)
    const nameUpdate = nameUpdates[member.id]
    map[member.id] = {
      memberId: member.id,
      firstName: nameUpdate?.newFirstName ?? member.firstName,
      lastName: nameUpdate?.newLastName ?? member.lastName,
      attendingWelcomeParty: existing?.attendingWelcomeParty ?? null,
      attendingCeremony: existing?.attendingCeremony ?? null,
      attendingReception: existing?.attendingReception ?? null,
      attendingFarewellBrunch: existing?.attendingFarewellBrunch ?? null,
      dietaryRestrictions: existing?.dietaryRestrictions ?? '',
    }
  }
  return map
}

export default function RsvpPage() {
  const [step, setStep] = useState<Step>(1)
  const [party, setParty] = useState<PartyWithRsvp | null>(null)
  const [nameUpdates, setNameUpdates] = useState<Record<string, { newFirstName: string; newLastName: string }>>({})
  const [declinedGuests, setDeclinedGuests] = useState<Set<string>>(new Set())
  const [responses, setResponses] = useState<Record<string, MemberResponse>>({})
  const [loadingParty, setLoadingParty] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const isPastDeadline = new Date() > RSVP_DEADLINE

  async function handlePartySelected(partyId: string) {
    setLoadingParty(true)
    setLoadError(null)
    try {
      const res = await fetch(`/api/rsvp/party/${partyId}`)
      if (!res.ok) throw new Error('Party not found')
      const data: PartyWithRsvp = await res.json()
      setParty(data)

      // Pre-fill name updates from DB
      const updates: Record<string, { newFirstName: string; newLastName: string }> = {}
      for (const nu of data.nameUpdates) {
        updates[nu.memberId] = { newFirstName: nu.newFirstName, newLastName: nu.newLastName ?? '' }
      }
      setNameUpdates(updates)
      setResponses(buildInitialResponses(data, updates))
      setStep(2)
    } catch {
      setLoadError('We couldn\'t load your party details. Please try again.')
    } finally {
      setLoadingParty(false)
    }
  }

  function handleNameUpdatesChange(updates: Record<string, { newFirstName: string; newLastName: string }>) {
    setNameUpdates(updates)
    if (party) {
      setResponses((prev) => {
        const next = { ...prev }
        for (const [memberId, u] of Object.entries(updates)) {
          if (next[memberId]) {
            next[memberId] = { ...next[memberId], firstName: u.newFirstName, lastName: u.newLastName }
          }
        }
        return next
      })
    }
  }

  function handleDeclinedGuestsChange(declined: Set<string>) {
    setDeclinedGuests(declined)
    // Mark all events as not attending for declined guests
    setResponses((prev) => {
      const next = { ...prev }
      for (const memberId of declined) {
        if (next[memberId]) {
          next[memberId] = {
            ...next[memberId],
            attendingWelcomeParty: false,
            attendingCeremony: false,
            attendingReception: false,
            attendingFarewellBrunch: false,
          }
        }
      }
      // If a guest was un-declined, reset their responses to null so they fill them in
      for (const memberId of Object.keys(next)) {
        if (!declined.has(memberId) && declinedGuests.has(memberId)) {
          next[memberId] = {
            ...next[memberId],
            attendingWelcomeParty: null,
            attendingCeremony: null,
            attendingReception: null,
            attendingFarewellBrunch: null,
          }
        }
      }
      return next
    })
  }

  function handleStep2Continue() {
    setStep(3)
  }

  function handleStep3Continue() {
    setStep(4)
  }

  const greetingName = party ? partyGreetingName(party, nameUpdates) : ''

  return (
    <main style={{ backgroundColor: '#FFF8F0' }} className="min-h-screen pb-24">
      {/* Page header */}
      <section className="flex flex-col items-center gap-4 px-6 pt-16 pb-10 text-center">
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
          {step === 'success' ? 'Thank You' : 'Kindly Reply'}
        </motion.h1>
        <motion.div
          className="mx-auto h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        {step !== 'success' && typeof step === 'number' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-1"
          >
            <StepIndicator current={step} total={4} />
          </motion.div>
        )}
      </section>

      <div className="mx-auto max-w-2xl px-6">

        {/* Past deadline notice */}
        {isPastDeadline && step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded border px-6 py-5 font-serif text-center space-y-2 mb-8"
            style={{ borderColor: '#C5A258', color: '#722F37', backgroundColor: '#fffbf0' }}
          >
            <p className="text-base">The RSVP deadline of July 15, 2026 has passed.</p>
            <p className="text-sm" style={{ opacity: 0.75 }}>
              Please reach out to us at{' '}
              <a href="mailto:eugenie.gruman@gmail.com" className="underline underline-offset-2">
                eugenie.gruman@gmail.com
              </a>
              {' '}if you need to make changes.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">

          {/* Step 1: Search */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="font-serif text-center text-base italic leading-relaxed mb-4"
                style={{ color: '#722F37', opacity: 0.8 }}>
                Please search for your name to begin.{' '}
                <span className="not-italic">Kindly reply by July 15, 2026.</span>
              </p>
              <GuestLookup onPartySelected={handlePartySelected} />
              {loadingParty && (
                <div className="flex items-center gap-2 font-serif text-sm" style={{ color: '#C5A258' }}>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading…
                </div>
              )}
              {loadError && (
                <p className="font-serif text-sm text-center text-red-400">{loadError}</p>
              )}
            </motion.div>
          )}

          {/* Step 2: Confirm party + name guests */}
          {step === 2 && party && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-6"
            >
              <p className="font-serif text-center text-xl" style={{ color: '#722F37' }}>
                Welcome, <span className="italic">{greetingName}</span>!
              </p>
              <PartyConfirmation
                party={party}
                nameUpdates={nameUpdates}
                declinedGuests={declinedGuests}
                onNameUpdatesChange={handleNameUpdatesChange}
                onDeclinedGuestsChange={handleDeclinedGuestsChange}
                onContinue={handleStep2Continue}
              />
            </motion.div>
          )}

          {/* Step 3: Event attendance */}
          {step === 3 && party && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <EventAttendance
                party={party}
                nameUpdates={nameUpdates}
                declinedGuests={declinedGuests}
                responses={responses}
                onResponsesChange={setResponses}
                onBack={() => setStep(2)}
                onContinue={handleStep3Continue}
              />
            </motion.div>
          )}

          {/* Step 4: Review & submit */}
          {step === 4 && party && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <ReviewAndConfirm
                party={party}
                nameUpdates={nameUpdates}
                responses={responses}
                onBack={() => setStep(3)}
                onSuccess={() => setStep('success')}
              />
            </motion.div>
          )}

          {/* Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <RsvpSuccess firstName={greetingName} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  )
}
