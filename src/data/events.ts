import type { EventKey } from '@/types/rsvp'

export interface EventMeta {
  name: string
  date: string
  time: string
  venue: string
  address: string
  dressCode: string
}

export const EVENTS: Record<EventKey, EventMeta> = {
  welcomeParty: {
    name: 'Welcome Party',
    date: 'Saturday, September 5, 2026',
    time: '7:00 PM',
    venue: 'Automobile Club de France',
    address: '6 Place de la Concorde, Paris 8e',
    dressCode: 'Cocktail attire',
  },
  ceremony: {
    name: 'Wedding Ceremony',
    date: 'Sunday, September 6, 2026',
    time: '5:00 PM',
    venue: 'Pavillon Ledoyen',
    address: '8 Avenue Dutuit, Paris 8e',
    dressCode: 'Black tie',
  },
  reception: {
    name: 'Reception',
    date: 'Sunday, September 6, 2026',
    time: 'Following the ceremony',
    venue: 'Pavillon Ledoyen',
    address: '8 Avenue Dutuit, Paris 8e',
    dressCode: 'Black tie',
  },
  farewellBrunch: {
    name: 'Farewell Brunch',
    date: 'Monday, September 7, 2026',
    time: '10:00 AM',
    venue: 'Laurent',
    address: '41 Avenue Gabriel, Paris 8e',
    dressCode: 'Smart casual',
  },
} as const
