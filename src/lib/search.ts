import type { Party, PartyMember } from '@/types/rsvp'

/** Strip accents and lowercase so "Eléonore" matches "eleonore" */
export function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Generate all searchable terms for a single member */
export function memberSearchTerms(member: PartyMember): string[] {
  if (member.isUnknownGuest) return []
  const first = normalize(member.firstName)
  const last = normalize(member.lastName)
  const full = `${first} ${last}`.trim()
  const terms = [first, full]
  if (last) terms.push(last)
  // Split hyphenated last names: "Carrel-Billiard" → ["carrel", "billiard"]
  if (last.includes('-')) {
    last.split('-').forEach((part) => { if (part) terms.push(part.trim()) })
  }
  return [...new Set(terms.filter(Boolean))]
}

/** Returns true if the query matches any known member in the party */
export function partyMatchesQuery(query: string, party: Party): boolean {
  const q = normalize(query)
  if (q.length < 2) return false
  return party.members.some((m) =>
    memberSearchTerms(m).some((term) => term.includes(q))
  )
}

/** Display name for a party in the search dropdown */
export function partyDisplayName(
  party: Party,
  nameUpdates: Record<string, { newFirstName: string; newLastName: string | null }> = {}
): string {
  const names = party.members.map((m) => {
    const update = nameUpdates[m.id]
    if (update) return `${update.newFirstName} ${update.newLastName ?? ''}`.trim()
    if (m.isUnknownGuest) return 'Guest'
    return `${m.firstName} ${m.lastName}`.trim()
  })

  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} & ${names[1]}`
  // For large parties truncate after 3 names
  if (names.length > 3) return `${names.slice(0, 3).join(', ')} +${names.length - 3} more`
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

/** Greeting name: first known member's first name */
export function partyGreetingName(
  party: Party,
  nameUpdates: Record<string, { newFirstName: string; newLastName: string | null }> = {}
): string {
  const firstKnown = party.members.find((m) => !m.isUnknownGuest)
  if (!firstKnown) return 'Guest'
  const update = nameUpdates[firstKnown.id]
  return update ? update.newFirstName : firstKnown.firstName
}
