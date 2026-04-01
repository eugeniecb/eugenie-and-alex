'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: 'easeOut' as const, delay },
})

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="flex flex-col items-center gap-8 px-6 pt-16 pb-0 text-center"
        style={{ backgroundColor: '#FFF8F0' }}
      >
        {/* Text */}
        <motion.h1
          className="script text-6xl leading-tight sm:text-7xl md:text-8xl"
          style={{ color: '#722F37' }}
          {...fadeUp(0.1)}
        >
          Eugénie &amp; Alex
        </motion.h1>

        <motion.div
          className="h-px w-24"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        />

        <motion.p
          className="font-serif text-base tracking-[0.25em] uppercase sm:text-lg"
          style={{ color: '#722F37' }}
          {...fadeUp(0.6)}
        >
          September 6, 2026 &nbsp;·&nbsp; Paris, France
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-1"
          style={{ color: '#722F37' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
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

        {/* Illustration — displayed as content, not background */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        >
          <Image
            src="/hero-illustration.png"
            alt="Watercolor illustration of Eugénie and Alex at Ledoyen, Paris"
            width={1000}
            height={1200}
            priority
            className="w-full h-auto"
          />
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
