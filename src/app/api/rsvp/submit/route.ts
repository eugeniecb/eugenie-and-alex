import { NextResponse } from 'next/server'
import { upsertRsvpResponses, upsertNameUpdates } from '@/lib/db'
import type { RsvpSubmission } from '@/types/rsvp'

export async function POST(request: Request) {
  let body: RsvpSubmission
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { partyId, responses, guestNameUpdates } = body

  if (!partyId || !Array.isArray(responses) || responses.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    await upsertRsvpResponses(partyId, responses)

    if (guestNameUpdates && guestNameUpdates.length > 0) {
      await upsertNameUpdates(partyId, guestNameUpdates)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = String(error)
    if (msg.includes('not configured')) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Vercel Postgres.' },
        { status: 503 }
      )
    }
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 })
  }
}
