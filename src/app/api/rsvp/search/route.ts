import { type NextRequest, NextResponse } from 'next/server'
import partiesData from '@/data/guests-parties.json'
import { partyMatchesQuery, partyDisplayName, normalize } from '@/lib/search'
import { getAllNameUpdates } from '@/lib/db'
import type { Party } from '@/types/rsvp'

const parties = partiesData.parties as Party[]

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''
  if (normalize(q).length < 2) {
    return NextResponse.json({ parties: [] })
  }

  // Load name updates so renamed "Guest" members are searchable
  const nameUpdateRows = await getAllNameUpdates()
  const nameUpdateMap: Record<string, Record<string, { newFirstName: string; newLastName: string | null }>> = {}
  for (const row of nameUpdateRows) {
    if (!nameUpdateMap[row.partyId]) nameUpdateMap[row.partyId] = {}
    nameUpdateMap[row.partyId][row.memberId] = {
      newFirstName: row.newFirstName,
      newLastName: row.newLastName,
    }
  }

  // Match against static data
  const matched = parties.filter((p) => partyMatchesQuery(q, p))

  // Also match against renamed guests in DB
  const nq = normalize(q)
  const dbMatchedPartyIds = new Set<string>()
  for (const row of nameUpdateRows) {
    const fn = normalize(row.newFirstName)
    const ln = normalize(row.newLastName ?? '')
    const full = `${fn} ${ln}`.trim()
    if (fn.includes(nq) || ln.includes(nq) || full.includes(nq)) {
      dbMatchedPartyIds.add(row.partyId)
    }
  }

  // Merge DB matches with static matches (dedup by partyId)
  const seen = new Set(matched.map((p) => p.partyId))
  for (const partyId of dbMatchedPartyIds) {
    if (!seen.has(partyId)) {
      const party = parties.find((p) => p.partyId === partyId)
      if (party) matched.push(party)
      seen.add(partyId)
    }
  }

  const results = matched.slice(0, 10).map((p) => ({
    partyId: p.partyId,
    displayName: partyDisplayName(p, nameUpdateMap[p.partyId] ?? {}),
    memberCount: p.members.length,
  }))

  return NextResponse.json({ parties: results })
}
