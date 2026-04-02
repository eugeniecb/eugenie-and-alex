import { NextResponse } from 'next/server'
import partiesData from '@/data/guests-parties.json'
import { getExistingRsvp, getNameUpdates } from '@/lib/db'
import type { Party } from '@/types/rsvp'

const parties = partiesData.parties as Party[]

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ partyId: string }> }
) {
  const { partyId } = await params
  const party = parties.find((p) => p.partyId === partyId)

  if (!party) {
    return NextResponse.json({ error: 'Party not found' }, { status: 404 })
  }

  const [existingResponses, nameUpdates] = await Promise.all([
    getExistingRsvp(partyId),
    getNameUpdates(partyId),
  ])

  return NextResponse.json({
    ...party,
    existingResponses,
    nameUpdates,
    hasExistingRsvp: existingResponses.length > 0,
  })
}
