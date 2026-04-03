'use client'

import { motion } from 'framer-motion'
import { Plane, Train, MapPin } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: 'easeOut' as const, delay },
})

function Divider() {
  return (
    <motion.div
      className="mx-auto h-px w-16"
      style={{ backgroundColor: '#C5A258' }}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      className="font-serif text-3xl sm:text-4xl text-center"
      style={{ color: '#722F37' }}
      {...fadeUp(0.05)}
    >
      {children}
    </motion.h2>
  )
}

export default function TravelPage() {
  return (
    <main style={{ backgroundColor: '#FFF8F0' }}>

      {/* ── Page header ── */}
      <section className="flex flex-col items-center gap-4 px-6 pt-16 pb-10 text-center">
        <Divider />
        <motion.h1 className="script text-5xl sm:text-6xl" style={{ color: '#722F37' }} {...fadeUp(0.1)}>
          Travel and Lodging
        </motion.h1>
        <motion.p
          className="max-w-lg font-serif text-base sm:text-lg leading-relaxed"
          style={{ color: '#722F37', opacity: 0.8 }}
          {...fadeUp(0.2)}
        >
          Everything you need to find your way to Paris and settle in for the weekend.
        </motion.p>
        <Divider />
      </section>

      {/* ── Where to Stay ── */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-col items-center gap-10">
          <motion.div {...fadeUp(0)}>
            <MapPin size={28} strokeWidth={1.2} style={{ color: '#C5A258' }} className="mx-auto" />
          </motion.div>
          <SectionTitle>Where to Stay</SectionTitle>

          {/* Hotel cards */}
          <div className="flex flex-col gap-6 w-full">
            {[
              {
                type: 'Hotel',
                name: 'Nuage',
                description: 'To book, please email info@nuage.paris and mention you are reaching out for Eugénie and Alex\'s wedding.',
                email: 'info@nuage.paris',
                href: 'https://nuage.paris',
              },
              {
                type: 'Hotel',
                name: 'Hôtel Perpetual',
                description: 'To book, please email contact@perpetual.paris and mention you are reaching out for Eugénie and Alex\'s wedding.',
                email: 'contact@perpetual.paris',
                href: 'https://hotelperpetual.paris',
              },
              {
                type: 'House or Rental',
                name: 'Airbnb',
                description: 'Airbnb has a lot of great options for stays in Paris! Make sure you stay within a reasonable distance of Pavillon Ledoyen to make your experience as easy as possible.',
                email: null,
                href: 'https://www.airbnb.com/s/8th-arrondissement--Paris--France/homes',
              },
            ].map(({ type, name, description, email, href }, i) => (
              <motion.div
                key={name}
                className="rounded-lg border bg-white px-8 py-8 font-serif text-center space-y-3"
                style={{ borderColor: '#e8d5c4', color: '#722F37' }}
                {...fadeUp(i * 0.1)}
              >
                <p className="text-sm tracking-widest uppercase" style={{ opacity: 0.6 }}>{type}</p>
                <p className="text-2xl tracking-[0.15em] uppercase font-semibold">{name}</p>
                <p className="text-base leading-relaxed max-w-lg mx-auto" style={{ opacity: 0.85 }}>
                  {email ? (
                    <>
                      To book, please email{' '}
                      <a
                        href={`mailto:${email}?subject=Eugénie and Alex's Wedding`}
                        className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                      >
                        {email}
                      </a>{' '}
                      and mention you are reaching out for Eugénie and Alex&rsquo;s wedding.
                    </>
                  ) : description}
                </p>
                <div className="pt-2">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border px-10 py-3 text-sm tracking-widest uppercase transition-colors hover:bg-stone-50"
                    style={{ borderColor: '#722F37', color: '#722F37' }}
                  >
                    View
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Getting to Paris ── */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          <motion.div {...fadeUp(0)}>
            <Plane size={28} strokeWidth={1.2} style={{ color: '#C5A258' }} className="mx-auto" />
          </motion.div>
          <SectionTitle>Getting to Paris</SectionTitle>
          <motion.div
            className="w-full rounded-lg border bg-white px-8 py-8 font-serif leading-relaxed space-y-4"
            style={{ borderColor: '#e8d5c4', color: '#722F37' }}
            {...fadeUp(0.1)}
          >
            <p>
              Paris is served by two international airports:
            </p>
            <div className="space-y-3">
              <div>
                <p className="font-semibold tracking-wide">Charles de Gaulle (CDG)</p>
                <p style={{ opacity: 0.85 }}>
                  The main hub for transatlantic flights. From CDG, the RER B train runs directly into central Paris in about 35–45 minutes (around €12). Taxis to the 8th arrondissement take 45–60 minutes depending on traffic and cost approximately €55–70.
                </p>
              </div>
              <div>
                <p className="font-semibold tracking-wide">Orly (ORY)</p>
                <p style={{ opacity: 0.85 }}>
                  Closer to the city center, primarily used for European connections. The Orlyval shuttle links to the RER B, or taxis run about 30–45 minutes and cost €35–50 to the 8th.
                </p>
              </div>
            </div>
            <p style={{ opacity: 0.75 }} className="text-sm pt-2">
              We recommend booking transatlantic flights 4–6 months in advance for the best fares. September is a busy travel month for Paris.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Getting Around ── */}
      <section className="mx-auto max-w-3xl px-6 py-12 pb-20">
        <div className="flex flex-col items-center gap-6">
          <motion.div {...fadeUp(0)}>
            <Train size={28} strokeWidth={1.2} style={{ color: '#C5A258' }} className="mx-auto" />
          </motion.div>
          <SectionTitle>Getting Around</SectionTitle>
          <motion.p
            className="font-serif text-center text-base leading-relaxed"
            style={{ color: '#722F37', opacity: 0.8 }}
            {...fadeUp(0.05)}
          >
            All wedding venues are in the <span className="font-semibold">8th arrondissement</span>, near the Champs-Élysées — one of the most walkable and well-connected neighborhoods in Paris.
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-3 w-full">
            {[
              {
                icon: '🚇',
                title: 'Métro',
                body: 'Lines 1, 9, and 13 all serve the 8th. The Champs-Élysées–Clemenceau and Franklin D. Roosevelt stops are closest. Single tickets cost €2.15 or buy a carnet of 10.',
              },
              {
                icon: '🚕',
                title: 'Taxi & Rideshare',
                body: 'Taxis are metered and plentiful. Uber, Bolt, and the French app Heetch all operate in Paris. Expect short rides within the 8th to cost €8–15.',
              },
              {
                icon: '🚶',
                title: 'On Foot',
                body: 'The Champs-Élysées and surrounding streets are made for walking. Most points of interest are within a 10-minute stroll of each other.',
              },
            ].map(({ icon, title, body }, i) => (
              <motion.div
                key={title}
                className="rounded-lg border bg-white px-6 py-6 text-center font-serif space-y-3"
                style={{ borderColor: '#e8d5c4', color: '#722F37' }}
                {...fadeUp(i * 0.08)}
              >
                <div className="text-3xl">{icon}</div>
                <p className="font-semibold tracking-wide text-base">{title}</p>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.85 }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
