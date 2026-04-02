'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { defaultContent, SiteContent } from '@/lib/content'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: 'easeOut' as const, delay },
})

const flapTransition = {
  duration: 0.55,
  repeat: Infinity,
  repeatType: 'reverse' as const,
  ease: 'easeInOut' as const,
}

export default function Home() {
  const [welcomeTitle, setWelcomeTitle] = useState(defaultContent.home_welcome_title)
  const [welcomeBody, setWelcomeBody] = useState(defaultContent.home_welcome_body)

  const { scrollY } = useScroll()
  // Left butterfly drifts up, right butterfly drifts down
  const leftY  = useTransform(scrollY, [0, 1500], [0, -260])
  const rightY = useTransform(scrollY, [0, 1500], [0,  260])

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data: SiteContent) => {
        if (data.home_welcome_title) setWelcomeTitle(data.home_welcome_title)
        if (data.home_welcome_body) setWelcomeBody(data.home_welcome_body)
      })
      .catch(() => {})
  }, [])

  return (
    <main>

      {/* ── Butterflies (fixed, home page only) ── */}

      {/* Left pink — drifts up */}
      <motion.div
        style={{ y: leftY }}
        className="fixed top-[36vh] left-[12vw] z-30 pointer-events-none hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85, scaleX: [1, 0.5, 1] }}
        transition={{ opacity: { delay: 1.4, duration: 1 }, scaleX: { ...flapTransition, delay: 0.2 } }}
      >
        <Image src="/butterfly.png" alt="" width={56} height={56} className="drop-shadow-sm" />
      </motion.div>

      {/* Left blue — drifts up slightly slower, offset below pink */}
      <motion.div
        style={{ y: leftY }}
        className="fixed top-[44vh] left-[10vw] z-30 pointer-events-none hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85, scaleX: [1, 0.5, 1] }}
        transition={{ opacity: { delay: 1.7, duration: 1 }, scaleX: { ...flapTransition, delay: 0.55 } }}
      >
        <Image src="/butterfly-blue.png" alt="" width={48} height={48} className="drop-shadow-sm" />
      </motion.div>

      {/* Right pink — drifts down, mirrored */}
      <motion.div
        style={{ y: rightY }}
        className="fixed top-[40vh] right-[12vw] z-30 pointer-events-none hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85, scaleX: [1, 0.5, 1] }}
        transition={{ opacity: { delay: 1.8, duration: 1 }, scaleX: { ...flapTransition, delay: 0.35 } }}
      >
        <Image src="/butterfly.png" alt="" width={56} height={56} className="drop-shadow-sm" style={{ transform: 'scaleX(-1)' }} />
      </motion.div>

      {/* Right blue — drifts down, offset below pink */}
      <motion.div
        style={{ y: rightY }}
        className="fixed top-[48vh] right-[10vw] z-30 pointer-events-none hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85, scaleX: [1, 0.5, 1] }}
        transition={{ opacity: { delay: 2.1, duration: 1 }, scaleX: { ...flapTransition, delay: 0.7 } }}
      >
        <Image src="/butterfly-blue.png" alt="" width={48} height={48} className="drop-shadow-sm" style={{ transform: 'scaleX(-1)' }} />
      </motion.div>

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
          Eugénie <span className="amp">&amp;</span> Alex
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
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Illustration */}
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
          {welcomeTitle}
        </motion.h2>

        <motion.p
          className="max-w-xl font-serif text-lg leading-relaxed"
          style={{ color: '#722F37', opacity: 0.85 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          {welcomeBody}
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
