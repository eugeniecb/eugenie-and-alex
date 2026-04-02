'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { defaultContent, SiteContent } from '@/lib/content'

const CLD = 'https://res.cloudinary.com/dl7hw5hs5/image/upload/f_auto,q_auto'
const LAYERS = {
  sky:      `${CLD}/v1775141596/sky_t7wj9z.png`,
  building: `${CLD}/v1775141591/building_njrcwv.png`,
  foliage:  `${CLD}/v1775141593/fruits_nigqpr.png`,
  ground:   `${CLD}/v1775141595/ground_fbq1kp.png`,
  couple:   `${CLD}/v1775141592/couple_cykuvj.png`,
}

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

  // Butterfly parallax — uses global scroll position
  const { scrollY } = useScroll()
  const leftY  = useTransform(scrollY, [0, 1500], [0, -260])
  const rightY = useTransform(scrollY, [0, 1500], [0,  260])

  // Hero layer parallax — scoped to the hero container so calculations stop once it scrolls out
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Transformer: maps progress [0→1] to pixels, halved on mobile to reduce jank
  const px = (multiplier: number) => (p: number) => {
    if (typeof window === 'undefined') return 0
    const factor = window.innerWidth < 640 ? 0.5 : 1
    return p * window.innerHeight * multiplier * factor
  }

  const skyY      = useTransform(scrollYProgress, px(0.05))
  const buildingY = useTransform(scrollYProgress, px(0.15))
  const foliageY  = useTransform(scrollYProgress, px(0.25))
  const groundY   = useTransform(scrollYProgress, px(0.25))
  const coupleY   = useTransform(scrollYProgress, px(0.35))

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

      {/* ── Hero — full-viewport parallax ── */}
      <div
        ref={heroRef}
        style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
      >
        {/* Layer 1: Sky — slowest (furthest back) */}
        <motion.div
          style={{
            y: skyY,
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            willChange: 'transform',
          }}
        >
          <Image src={LAYERS.sky} alt="" fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        </motion.div>

        {/* Layer 2: Building */}
        <motion.div
          style={{
            y: buildingY,
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            willChange: 'transform',
          }}
        >
          <Image src={LAYERS.building} alt="" fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        </motion.div>

        {/* Layer 3: Foliage */}
        <motion.div
          style={{
            y: foliageY,
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            willChange: 'transform',
          }}
        >
          <Image src={LAYERS.foliage} alt="" fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        </motion.div>

        {/* Layer 4: Ground */}
        <motion.div
          style={{
            y: groundY,
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            willChange: 'transform',
          }}
        >
          <Image src={LAYERS.ground} alt="" fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        </motion.div>

        {/* Layer 5: Couple — fastest (closest to viewer) */}
        <motion.div
          style={{
            y: coupleY,
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            willChange: 'transform',
          }}
        >
          <Image src={LAYERS.couple} alt="Eugénie and Alex" fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        </motion.div>

        {/* Text overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '1.5rem',
            gap: '1.5rem',
          }}
        >
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

          {/* Scroll indicator — pinned to bottom of hero */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '2rem',
              color: '#722F37',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
            }}
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
