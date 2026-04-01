'use client'

import { motion } from 'framer-motion'

const faqs = [
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
      'Please visit our Travel page for hotel recommendations. We have curated a selection of nearby hotels — email them directly and mention you are attending Eugénie and Alex\'s wedding for availability.',
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
]

export default function FaqPage() {
  return (
    <main style={{ backgroundColor: '#FFF8F0' }}>
      {/* Page header */}
      <section className="flex flex-col items-center gap-4 px-6 pt-16 pb-12 text-center">
        <motion.div
          className="mx-auto h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.h1
          className="script text-5xl sm:text-6xl"
          style={{ color: '#722F37' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          FAQ
        </motion.h1>
        <motion.div
          className="mx-auto h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </section>

      {/* FAQ rows */}
      <section className="mx-auto max-w-5xl px-6 pb-32">
        {faqs.map(({ question, answer }, i) => (
          <motion.div
            key={question}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 * i }}
          >
            {/* Divider between rows */}
            {i > 0 && (
              <div className="h-px w-full" style={{ backgroundColor: '#e8d5c4' }} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1px_3fr] gap-0">
              {/* Question */}
              <div className="flex flex-col justify-center gap-3 px-6 py-10 sm:pr-12 text-center sm:text-left">
                <p
                  className="font-serif text-xs tracking-[0.2em]"
                  style={{ color: '#722F37', opacity: 0.5 }}
                >
                  Question
                </p>
                <h2
                  className="font-serif text-xl sm:text-2xl tracking-[0.15em] uppercase leading-snug"
                  style={{ color: '#722F37' }}
                >
                  {question}
                </h2>
              </div>

              {/* Vertical divider — hidden on mobile */}
              <div
                className="hidden sm:block w-px self-stretch"
                style={{ backgroundColor: '#e8d5c4' }}
              />

              {/* Answer */}
              <div className="flex flex-col justify-center gap-3 px-6 py-10 sm:pl-12 text-center">
                <p
                  className="font-serif text-xs tracking-[0.2em]"
                  style={{ color: '#722F37', opacity: 0.5 }}
                >
                  Answer
                </p>
                <p
                  className="font-serif text-base leading-relaxed"
                  style={{ color: '#722F37', opacity: 0.85 }}
                >
                  {answer}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Final divider */}
        <div className="h-px w-full" style={{ backgroundColor: '#e8d5c4' }} />
      </section>
    </main>
  )
}
