'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { defaultContent, SiteContent } from '@/lib/content'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: 'easeOut' as const, delay },
})

export default function Home() {
  const [welcomeTitle, setWelcomeTitle] = useState(defaultContent.home_welcome_title)
  const [welcomeBody, setWelcomeBody] = useState(defaultContent.home_welcome_body)

  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  })

  // Illustration rotates open like a greeting card (left-edge hinge)
  const rotateY = useTransform(scrollYProgress, [0, 0.7], [0, -82])
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.65], [0, 1])
  const textY = useTransform(scrollYProgress, [0.25, 0.65], [20, 0])

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
    <main style={{ backgroundColor: '#FFF8F0' }}>

      {/* ── Title ── */}
      <section className="flex flex-col items-center gap-8 px-6 pt-16 pb-8 text-center">
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

        <motion.div
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
      </section>

      {/* ── Greeting Card ── */}
      {/* Outer div provides scroll room; inner sticky div holds the card */}
      <div ref={cardRef} style={{ height: '280vh' }}>
        <div
          className="sticky top-0 flex items-center justify-center"
          style={{ height: '100vh', backgroundColor: '#FFF8F0' }}
        >
          {/* Perspective wrapper — required for 3-D rotateY to appear in depth */}
          <div
            className="relative w-full max-w-2xl mx-auto px-6"
            style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
          >
            {/* Inside of card: welcome text revealed as cover rotates away */}
            <motion.div
              style={{ opacity: textOpacity, y: textY }}
              className="flex flex-col items-center gap-8 py-20 text-center"
            >
              <div className="h-px w-16" style={{ backgroundColor: '#C5A258' }} />
              <h2
                className="script text-4xl sm:text-5xl"
                style={{ color: '#722F37' }}
              >
                {welcomeTitle}
              </h2>
              <p
                className="font-serif text-lg leading-relaxed max-w-lg"
                style={{ color: '#722F37', opacity: 0.85 }}
              >
                {welcomeBody}
              </p>
              <div className="h-px w-16" style={{ backgroundColor: '#C5A258' }} />
            </motion.div>

            {/* Cover: illustration, hinges from its left edge */}
            <motion.div
              style={{
                rotateY,
                originX: 0,
                originY: 0.5,
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                backgroundColor: '#FFF8F0',
              }}
            >
              <Image
                src="/hero-illustration.png"
                alt="Watercolor illustration of Eugénie and Alex at Ledoyen, Paris"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>

    </main>
  )
}
