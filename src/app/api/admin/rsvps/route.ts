import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import partiesData from '@/data/guests-parties.json'
import type { Party } from '@/types/rsvp'

const parties = partiesData.parties as Party[]

function getPool() {
  const raw = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL
  if (!raw) throw new Error('Database not configured')
  const url = raw
    .replace(/[?&]sslmode=[^&]*/g, (m) => m.startsWith('?') ? '?' : '')
    .replace(/[?&]pgbouncer=[^&]*/g, (m) => m.startsWith('?') ? '?' : '')
    .replace(/[?&]supa=[^&]*/g, (m) => m.startsWith('?') ? '?' : '')
    .replace(/\?$/, '')
  return new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } })
}

export async function GET(request: Request) {
  const token = request.headers.get('x-admin-token')
  if (!process.env.ADMIN_PASSWORD || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pool = getPool()
  try {
    const [rsvpResult, nameResult] = await Promise.all([
      pool.query(`
        SELECT party_id, member_id, first_name, last_name,
               attending_welcome_party, attending_ceremony,
               attending_reception, attending_farewell_brunch,
               dietary_restrictions, updated_at
        FROM rsvp_responses
        ORDER BY updated_at DESC
      `),
      pool.query(`SELECT party_id, member_id, new_first_name, new_last_name FROM guest_name_updates`),
    ])

    // Build name update map
    const nameUpdates: Record<string, Record<string, { firstName: string; lastName: string }>> = {}
    for (const row of nameResult.rows) {
      if (!nameUpdates[row.party_id]) nameUpdates[row.party_id] = {}
      nameUpdates[row.party_id][row.member_id] = {
        firstName: row.new_first_name,
        lastName: row.new_last_name ?? '',
      }
    }

    // Group responses by party
    const byParty: Record<string, typeof rsvpResult.rows> = {}
    for (const row of rsvpResult.rows) {
      if (!byParty[row.party_id]) byParty[row.party_id] = []
      byParty[row.party_id].push(row)
    }

    // Build response with party display names
    const results = Object.entries(byParty).map(([partyId, rows]) => {
      const partyDef = parties.find((p) => p.partyId === partyId)
      const members = rows.map((row) => {
        const nameUpdate = nameUpdates[partyId]?.[row.member_id]
        return {
          memberId: row.member_id,
          firstName: nameUpdate?.firstName ?? row.first_name,
          lastName: nameUpdate?.lastName ?? row.last_name ?? '',
          attendingWelcomeParty: row.attending_welcome_party,
          attendingCeremony: row.attending_ceremony,
          attendingReception: row.attending_reception,
          attendingFarewellBrunch: row.attending_farewell_brunch,
          dietaryRestrictions: row.dietary_restrictions ?? '',
          updatedAt: row.updated_at,
        }
      })

      // Party display name from static data + name updates
      const displayNames = (partyDef?.members ?? []).map((m) => {
        const nu = nameUpdates[partyId]?.[m.id]
        if (nu) return `${nu.firstName} ${nu.lastName}`.trim()
        if (m.isUnknownGuest) {
          // Check if they were given a name
          const response = rows.find((r) => r.member_id === m.id)
          if (response) return `${response.first_name} ${response.last_name ?? ''}`.trim()
          return 'Guest'
        }
        return `${m.firstName} ${m.lastName}`.trim()
      })

      return { partyId, displayName: displayNames.join(' & '), members }
    })

    // Summary stats
    const allMembers = results.flatMap((p) => p.members)
    const stats = {
      totalResponded: results.length,
      welcomeParty: allMembers.filter((m) => m.attendingWelcomeParty).length,
      ceremony: allMembers.filter((m) => m.attendingCeremony).length,
      reception: allMembers.filter((m) => m.attendingReception).length,
      farewellBrunch: allMembers.filter((m) => m.attendingFarewellBrunch).length,
      dietary: allMembers.filter((m) => m.dietaryRestrictions).length,
    }

    return NextResponse.json({ parties: results, stats })
  } finally {
    await pool.end()
  }
}
