export type EventKey = 'welcomeParty' | 'ceremony' | 'reception' | 'farewellBrunch'

export interface MemberEvents {
  welcomeParty: boolean
  ceremony: boolean
  reception: boolean
  farewellBrunch: boolean
}

export interface PartyMember {
  id: string
  firstName: string
  lastName: string
  isUnknownGuest: boolean
  events: MemberEvents
}

export interface Party {
  partyId: string
  members: PartyMember[]
}

export interface NameUpdate {
  memberId: string
  newFirstName: string
  newLastName: string | null
}

export interface ExistingResponse {
  memberId: string
  attendingWelcomeParty: boolean | null
  attendingCeremony: boolean | null
  attendingReception: boolean | null
  attendingFarewellBrunch: boolean | null
  dietaryRestrictions: string | null
}

export interface PartyWithRsvp extends Party {
  existingResponses: ExistingResponse[]
  nameUpdates: NameUpdate[]
  hasExistingRsvp: boolean
}

export interface MemberResponse {
  memberId: string
  firstName: string
  lastName: string
  attendingWelcomeParty: boolean | null
  attendingCeremony: boolean | null
  attendingReception: boolean | null
  attendingFarewellBrunch: boolean | null
  dietaryRestrictions: string
}

export interface RsvpSubmission {
  partyId: string
  responses: MemberResponse[]
  guestNameUpdates: { memberId: string; newFirstName: string; newLastName: string }[]
}
