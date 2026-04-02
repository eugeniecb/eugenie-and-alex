import { sql } from '@vercel/postgres'
import type { ExistingResponse, NameUpdate, MemberResponse } from '@/types/rsvp'

/** Returns null if DB isn't configured (no POSTGRES_URL env var) */
function isDbConfigured(): boolean {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL)
}

export async function getExistingRsvp(partyId: string): Promise<ExistingResponse[]> {
  if (!isDbConfigured()) return []
  try {
    const result = await sql`
      SELECT member_id, attending_welcome_party, attending_ceremony,
             attending_reception, attending_farewell_brunch, dietary_restrictions
      FROM rsvp_responses
      WHERE party_id = ${partyId}
    `
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
    const result = await sql`
      SELECT member_id, new_first_name, new_last_name
      FROM guest_name_updates
      WHERE party_id = ${partyId}
    `
    return result.rows.map((row) => ({
      memberId: row.member_id,
      newFirstName: row.new_first_name,
      newLastName: row.new_last_name,
    }))
  } catch {
    return []
  }
}

/** Search guest_name_updates for renamed guests matching the query */
export async function searchNameUpdates(
  normalizedQuery: string
): Promise<{ partyId: string; memberId: string }[]> {
  if (!isDbConfigured()) return []
  try {
    const pattern = `%${normalizedQuery}%`
    const result = await sql`
      SELECT party_id, member_id
      FROM guest_name_updates
      WHERE LOWER(unaccent_simple(new_first_name || ' ' || COALESCE(new_last_name, ''))) LIKE ${pattern}
         OR LOWER(unaccent_simple(new_first_name)) LIKE ${pattern}
         OR LOWER(unaccent_simple(COALESCE(new_last_name, ''))) LIKE ${pattern}
    `
    return result.rows.map((row) => ({ partyId: row.party_id, memberId: row.member_id }))
  } catch {
    // unaccent_simple may not be available — fall back to basic LIKE
    try {
      const pattern = `%${normalizedQuery}%`
      const result = await sql`
        SELECT party_id, member_id
        FROM guest_name_updates
        WHERE LOWER(new_first_name || ' ' || COALESCE(new_last_name, '')) LIKE ${pattern}
           OR LOWER(new_first_name) LIKE ${pattern}
           OR LOWER(COALESCE(new_last_name, '')) LIKE ${pattern}
      `
      return result.rows.map((row) => ({ partyId: row.party_id, memberId: row.member_id }))
    } catch {
      return []
    }
  }
}

export async function getAllNameUpdates(): Promise<
  { partyId: string; memberId: string; newFirstName: string; newLastName: string | null }[]
> {
  if (!isDbConfigured()) return []
  try {
    const result = await sql`
      SELECT party_id, member_id, new_first_name, new_last_name FROM guest_name_updates
    `
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
    await sql`
      INSERT INTO rsvp_responses (
        party_id, member_id, first_name, last_name,
        attending_welcome_party, attending_ceremony,
        attending_reception, attending_farewell_brunch,
        dietary_restrictions, updated_at
      ) VALUES (
        ${partyId}, ${r.memberId}, ${r.firstName}, ${r.lastName},
        ${r.attendingWelcomeParty}, ${r.attendingCeremony},
        ${r.attendingReception}, ${r.attendingFarewellBrunch},
        ${r.dietaryRestrictions || null}, NOW()
      )
      ON CONFLICT (party_id, member_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        attending_welcome_party = EXCLUDED.attending_welcome_party,
        attending_ceremony = EXCLUDED.attending_ceremony,
        attending_reception = EXCLUDED.attending_reception,
        attending_farewell_brunch = EXCLUDED.attending_farewell_brunch,
        dietary_restrictions = EXCLUDED.dietary_restrictions,
        updated_at = NOW()
    `
  }
}

export async function upsertNameUpdates(
  partyId: string,
  updates: { memberId: string; newFirstName: string; newLastName: string }[]
): Promise<void> {
  if (!isDbConfigured()) throw new Error('Database not configured')
  for (const u of updates) {
    await sql`
      INSERT INTO guest_name_updates (party_id, member_id, new_first_name, new_last_name, updated_at)
      VALUES (${partyId}, ${u.memberId}, ${u.newFirstName}, ${u.newLastName || null}, NOW())
      ON CONFLICT (party_id, member_id) DO UPDATE SET
        new_first_name = EXCLUDED.new_first_name,
        new_last_name = EXCLUDED.new_last_name,
        updated_at = NOW()
    `
  }
}
