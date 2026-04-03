export interface FaqItem {
  question: string
  answer: string
}

export interface Hotel {
  type: string
  name: string
  description: string
  email: string | null
  href: string
}

export type GuestTier = 'full-weekend' | 'wedding-only'

export interface EventItem {
  day: string
  date: string
  time: string
  title: string
  location: string
  address: string
  description: string
  attire: string
  /** Which guest tiers can see this event */
  tiers: GuestTier[]
}

export interface SiteContent {
  home_welcome_title: string
  home_welcome_body: string
  faq: FaqItem[]
  hotels: Hotel[]
  events: EventItem[]
}

export const defaultContent: SiteContent = {
  home_welcome_title: "We're getting married!",
  events: [
    {
      day: 'Saturday',
      date: 'September 5, 2026',
      time: '7:00 PM',
      title: 'Welcome Party',
      location: 'Automobile Club de France',
      address: '6 place de la Concorde, Paris VIII',
      description: 'Join us for an evening to kick off the weekend.',
      attire: 'Cocktail attire',
      tiers: ['full-weekend'],
    },
    {
      day: 'Sunday',
      date: 'September 6, 2026',
      time: '5:00 PM – 1:00 AM',
      title: 'Wedding Celebration',
      location: 'Pavillon Ledoyen',
      address: 'Carré des Champs-Élysées, Paris VIII',
      description: 'Please join us for our wedding ceremony and reception.',
      attire: 'Black tie',
      tiers: ['full-weekend', 'wedding-only'],
    },
    {
      day: 'Monday',
      date: 'September 7, 2026',
      time: '10:00 AM',
      title: 'Farewell Brunch',
      location: 'Laurent',
      address: '41 avenue Gabriel, Paris VIII',
      description: 'One last morning together in Paris. Jackets required for gentlemen; sneakers and jeans not permitted.',
      attire: 'Smart casual',
      tiers: ['full-weekend'],
    },
  ],
  home_welcome_body:
    'We are so happy to celebrate with you in the City of Light. This website has everything you need — event details, travel tips, and all the ways to be part of our day.',
  faq: [
    {
      question: 'What attire should I wear for the wedding?',
      answer:
        'The attire for the wedding is black tie. We encourage guests to wear tuxedos or suits, and long dresses or gowns.',
    },
    {
      question: 'What attire should I wear for the welcome event?',
      answer:
        'For guests joining us for the welcome event, we suggest cocktail attire. The Automobile Club de France does not allow shorts, jeans, or sneakers, so please plan accordingly. For men, suit or blazer jackets are required. Ties are optional.',
    },
    {
      question: 'What attire should I wear for the farewell brunch?',
      answer:
        'Smart casual is perfect for brunch. Jackets are required for gentlemen; sneakers and jeans are not permitted at Laurent.',
    },
    {
      question: 'How should I get around Paris?',
      answer:
        'Our venues are located in the heart of Paris, making it easy to get around. We recommend downloading Uber or the Taxi G7 app for convenient transportation. The Paris public transit system is also excellent and easy to navigate with the help of Google Maps.',
    },
    {
      question: 'Are kids welcome?',
      answer:
        'We love your little ones! However, due to venue capacity constraints, we are only able to invite a few children from our immediate families.',
    },
    {
      question: 'Will there be parking at the venues?',
      answer:
        'Paris parking is limited, and we strongly encourage guests to use taxis, rideshares, or the Métro rather than driving. The 8th arrondissement is very well served by public transport.',
    },
    {
      question: 'What is the best way to book a hotel?',
      answer:
        "Please visit our Travel page for hotel recommendations. We have curated a selection of nearby hotels — email them directly and mention you are attending Eugénie and Alex's wedding for availability.",
    },
    {
      question: 'I have a dietary restriction. Who should I tell?',
      answer:
        'Please note any dietary restrictions on your RSVP. If you have already submitted your RSVP and need to update us, please reach out at eugenieandalex2026@gmail.com.',
    },
    {
      question: 'Can I take photos during the ceremony?',
      answer:
        'We are having an unplugged ceremony and kindly ask guests to keep phones and cameras away during that portion of the day. Our photographer will capture every moment beautifully! Phones are of course welcome during the cocktail hour and reception.',
    },
  ],
  hotels: [
    {
      type: 'Hotel',
      name: 'Nuage',
      description:
        "To book, please email info@nuage.paris and mention you are reaching out for Eugénie and Alex's wedding.",
      email: 'info@nuage.paris',
      href: 'https://nuage.paris',
    },
    {
      type: 'Hotel',
      name: 'Hôtel Perpetual',
      description:
        "To book, please email contact@perpetual.paris and mention you are reaching out for Eugénie and Alex's wedding.",
      email: 'contact@perpetual.paris',
      href: 'https://hotelperpetual.paris',
    },
    {
      type: 'House or Rental',
      name: 'Airbnb',
      description:
        'Airbnb has a lot of great options for stays in Paris! Make sure you stay within a reasonable distance of Pavillon Ledoyen to make your experience as easy as possible.',
      email: null,
      href: 'https://www.airbnb.com/s/8th-arrondissement--Paris--France/homes',
    },
  ],
}
