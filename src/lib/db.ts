import { Pool } from 'pg'
import type { ExistingResponse, NameUpdate, MemberResponse } from '@/types/rsvp'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    const raw = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL
    if (!raw) throw new Error('Database not configured')
    // Strip sslmode from the URL so our ssl config below takes full effect
    const url = raw.replace(/[?&]sslmode=[^&]*/g, (m) => m.startsWith('?') ? '?' : '')
                   .replace(/[?&]pgbouncer=[^&]*/g, (m) => m.startsWith('?') ? '?' : '')
                   .replace(/[?&]supa=[^&]*/g, (m) => m.startsWith('?') ? '?' : '')
                   .replace(/\?$/, '')
    pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } })
  }
  return pool
}

function isDbConfigured(): boolean {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING)
}

async function query(text: string, params?: unknown[]) {
  return getPool().query(text, params)
}

export async function getExistingRsvp(partyId: string): Promise<ExistingResponse[]> {
  if (!isDbConfigured()) return []
  try {
    const result = await query(
      `SELECT member_id, attending_welcome_party, attending_ceremony,
              attending_reception, attending_farewell_brunch, dietary_restrictions
       FROM rsvp_responses WHERE party_id = $1`,
      [partyId]
    )
    return result.rows.map((row) => ({
      memberId: row.member_id,
      attendingWelcomeParty: row.attending_welcome_party,
      attendingCeremony: row.attending_ceremony,
      attendingReception: row.attending_reception,
      attendingFarewellBrunch: row.attending_farewell_brunch,
      dietaryRestrictions: row.dietary_restrictions,
    }))
  } catch {
    return []
  }
}

export async function getNameUpdates(partyId: string): Promise<NameUpdate[]> {
  if (!isDbConfigured()) return []
  try {
    const result = await query(
      `SELECT member_id, new_first_name, new_last_name
       FROM guest_name_updates WHERE party_id = $1`,
      [partyId]
    )
    return result.rows.map((row) => ({
      memberId: row.member_id,
      newFirstName: row.new_first_name,
      newLastName: row.new_last_name,
    }))
  } catch {
    return []
  }
}

export async function getAllNameUpdates(): Promise<
  { partyId: string; memberId: string; newFirstName: string; newLastName: string | null }[]
> {
  if (!isDbConfigured()) return []
  try {
    const result = await query(
      `SELECT party_id, member_id, new_first_name, new_last_name FROM guest_name_updates`
    )
    return result.rows.map((row) => ({
      partyId: row.party_id,
      memberId: row.member_id,
      newFirstName: row.new_first_name,
      newLastName: row.new_last_name,
    }))
  } catch {
    return []
  }
}

export async function upsertRsvpResponses(
  partyId: string,
  responses: MemberResponse[]
): Promise<void> {
  if (!isDbConfigured()) throw new Error('Database not configured')
  for (const r of responses) {
    await query(
      `INSERT INTO rsvp_responses (
         party_id, member_id, first_name, last_name,
         attending_welcome_party, attending_ceremony,
         attending_reception, attending_farewell_brunch,
         dietary_restrictions, updated_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       ON CONFLICT (party_id, member_id) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         attending_welcome_party = EXCLUDED.attending_welcome_party,
         attending_ceremony = EXCLUDED.attending_ceremony,
         attending_reception = EXCLUDED.attending_reception,
         attending_farewell_brunch = EXCLUDED.attending_farewell_brunch,
         dietary_restrictions = EXCLUDED.dietary_restrictions,
         updated_at = NOW()`,
      [
        partyId, r.memberId, r.firstName, r.lastName,
        r.attendingWelcomeParty, r.attendingCeremony,
        r.attendingReception, r.attendingFarewellBrunch,
        r.dietaryRestrictions || null,
      ]
    )
  }
}

export async function upsertNameUpdates(
  partyId: string,
  updates: { memberId: string; newFirstName: string; newLastName: string }[]
): Promise<void> {
  if (!isDbConfigured()) throw new Error('Database not configured')
  for (const u of updates) {
    await query(
      `INSERT INTO guest_name_updates (party_id, member_id, new_first_name, new_last_name, updated_at)
       VALUES ($1,$2,$3,$4,NOW())
       ON CONFLICT (party_id, member_id) DO UPDATE SET
         new_first_name = EXCLUDED.new_first_name,
         new_last_name = EXCLUDED.new_last_name,
         updated_at = NOW()`,
      [partyId, u.memberId, u.newFirstName, u.newLastName || null]
    )
  }
}
