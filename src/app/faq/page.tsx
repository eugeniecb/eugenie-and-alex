'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { defaultContent, FaqItem, SiteContent } from '@/lib/content'

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultContent.faq)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data: SiteContent) => { if (data.faq) setFaqs(data.faq) })
      .catch(() => {})
  }, [])

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
          Frequently Asked Questions
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
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 * i }}
          >
            {i > 0 && <div className="h-px w-full" style={{ backgroundColor: '#e8d5c4' }} />}

            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1px_3fr] gap-0">
              {/* Question */}
              <div className="flex flex-col justify-center gap-3 px-6 py-10 sm:pr-12 text-center sm:text-left">
                <p className="font-serif text-xs tracking-[0.2em]" style={{ color: '#722F37', opacity: 0.5 }}>
                  Question
                </p>
                <h2 className="font-serif text-xl sm:text-2xl tracking-[0.15em] uppercase leading-snug" style={{ color: '#722F37' }}>
                  {question}
                </h2>
              </div>

              {/* Vertical divider */}
              <div className="hidden sm:block w-px self-stretch" style={{ backgroundColor: '#e8d5c4' }} />

              {/* Answer */}
              <div className="flex flex-col justify-center gap-3 px-6 py-10 sm:pl-12 text-center">
                <p className="font-serif text-xs tracking-[0.2em]" style={{ color: '#722F37', opacity: 0.5 }}>
                  Answer
                </p>
                <p className="font-serif text-base leading-relaxed" style={{ color: '#722F37', opacity: 0.85 }}>
                  {answer}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        <div className="h-px w-full" style={{ backgroundColor: '#e8d5c4' }} />
      </section>
    </main>
  )
}
