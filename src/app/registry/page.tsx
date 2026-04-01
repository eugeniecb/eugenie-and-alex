'use client'

import Script from 'next/script'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' as const, delay },
})

export default function RegistryPage() {
  return (
    <main style={{ backgroundColor: '#FFF8F0' }}>
      {/* ── Page header ── */}
      <section className="flex flex-col items-center gap-4 px-6 pt-16 pb-10 text-center">
        <motion.div
          className="mx-auto h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.h1
          className="script text-5xl sm:text-6xl"
          style={{ color: '#722F37' }}
          {...fadeUp(0.1)}
        >
          Registry
        </motion.h1>
        <motion.p
          className="max-w-lg font-serif text-base sm:text-lg leading-relaxed"
          style={{ color: '#722F37', opacity: 0.8 }}
          {...fadeUp(0.2)}
        >
          Your presence in Paris is the greatest gift. If you would like to celebrate us further, we have curated a registry on Zola.
        </motion.p>
        <motion.div
          className="mx-auto h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        />
      </section>

      {/* ── Zola embed ── */}
      <section className="px-6 pb-24">
        <motion.div
          className="mx-auto max-w-5xl"
          {...fadeUp(0.3)}
        >
          <a
            className="zola-registry-embed"
            href="https://www.zola.com/registry/eugenieandalex"
            data-registry-key="eugenieandalex"
          >
            Our Zola Wedding Registry
          </a>
          <Script
            id="zola-wjs"
            src="https://widget.zola.com/js/widget.js"
            strategy="afterInteractive"
          />
        </motion.div>
      </section>
    </main>
  )
}
