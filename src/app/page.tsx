'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { defaultContent, SiteContent } from '@/lib/content'

export default function Home() {
  const [welcomeTitle, setWelcomeTitle] = useState(defaultContent.home_welcome_title)
  const [welcomeBody, setWelcomeBody] = useState(defaultContent.home_welcome_body)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data: SiteContent) => {
        if (data.home_welcome_title) setWelcomeTitle(data.home_welcome_title)
        if (data.home_welcome_body) setWelcomeBody(data.home_welcome_body)
      })
      .catch(() => {})
  }, [])

  // Scroll-driven greeting card animation
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  })

  // Cover tilts back from the bottom edge, then fades as it clears the frame
  const cardRotateX = useTransform(scrollYProgress, [0, 0.8], [0, -115])
  const cardOpacity  = useTransform(scrollYProgress, [0.2, 0.65], [1, 0])

  // Inside text fades in once the card is partially open
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.45], [0, 1])

  // Scroll hint fades out immediately
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  return (
    <main>

      {/* ── Greeting card ── */}
      {/*
        200vh gives plenty of scroll room.
        The inner div is sticky so the viewport stays fixed while you scroll.
        The perspective div creates the 3D stage — only the card cover
        gets a rotateX transform; the text underneath stays flat.
      */}
      <div ref={cardRef} style={{ height: '200vh' }}>
        <div
          className="sticky top-0 h-[100svh] overflow-hidden"
          style={{ backgroundColor: '#FFF8F0' }}
        >
          {/* 3D stage */}
          <div
            className="absolute inset-0"
            style={{ perspective: '1400px', perspectiveOrigin: '50% 100%' }}
          >
            {/* Inside text — lives beneath the cover */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
              style={{ opacity: textOpacity }}
            >
              <h1
                className="script text-6xl leading-tight sm:text-7xl md:text-8xl"
                style={{ color: '#722F37' }}
              >
                Eugénie &amp; Alex
              </h1>
              <div className="h-px w-24" style={{ backgroundColor: '#C5A258' }} />
              <p
                className="font-serif text-base tracking-[0.25em] uppercase sm:text-lg"
                style={{ color: '#722F37' }}
              >
                September 6, 2026 &nbsp;·&nbsp; Paris, France
              </p>
            </motion.div>

            {/* Card cover — the illustration rotates open */}
            <motion.div
              className="absolute inset-0"
              style={{
                rotateX: cardRotateX,
                transformOrigin: 'bottom center',
                opacity: cardOpacity,
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

          {/* Scroll hint — outside the 3D stage so it's never transformed */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
            style={{ opacity: scrollHintOpacity, color: '#722F37', zIndex: 10 }}
          >
            <span
              className="font-serif text-xs tracking-widest uppercase"
              style={{ color: '#C5A258' }}
            >
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <ChevronDown size={18} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </div>
      </div>

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
