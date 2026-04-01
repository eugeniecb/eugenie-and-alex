'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut', delay },
  }),
}

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
        {/* Placeholder background — replace src with your watercolor illustration */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/hero-illustration.jpg')",
            backgroundColor: '#f5ede4',
          }}
        />
        {/* Soft overlay so text is legible over any illustration */}
        <div className="absolute inset-0 bg-white/30" />

        {/* Hero text */}
        <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
          <motion.h1
            className="script text-6xl leading-tight sm:text-7xl md:text-8xl"
            style={{ color: '#722F37' }}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
          >
            Eugénie &amp; Alex
          </motion.h1>

          <motion.div
            className="h-px w-24"
            style={{ backgroundColor: '#C5A258' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          />

          <motion.p
            className="font-serif text-base tracking-[0.25em] uppercase sm:text-lg"
            style={{ color: '#722F37' }}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.7}
          >
            September 6, 2026 &nbsp;·&nbsp; Paris, France
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ color: '#722F37' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="font-serif text-xs tracking-widest uppercase" style={{ color: '#C5A258' }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Welcome ── */}
      <section
        className="flex flex-col items-center gap-8 px-6 py-24 text-center"
        style={{ backgroundColor: '#FFF8F0' }}
      >
        <motion.div
          className="h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />

        <motion.h2
          className="script text-4xl sm:text-5xl"
          style={{ color: '#722F37' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          We&rsquo;re getting married!
        </motion.h2>

        <motion.p
          className="max-w-xl font-serif text-lg leading-relaxed"
          style={{ color: '#722F37', opacity: 0.85 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          We are so happy to celebrate with you in the City of Light.
          This website has everything you need — event details, travel tips,
          and all the ways to be part of our day.
        </motion.p>

        <motion.div
          className="h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
        />
      </section>
    </main>
  )
}
