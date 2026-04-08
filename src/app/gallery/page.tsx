'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react'

const BASE = 'https://res.cloudinary.com/dl7hw5hs5/image/upload/f_auto,q_auto'

interface Photo {
  id: number
  src: string
  alt: string
  aspect: 'tall' | 'landscape' | 'square'
  rotate: number
  caption?: string
  date?: string
  location?: string
}

const photos: Photo[] = [
  // Summer 2023
  { id: 1,  src: `${BASE}/v1775101698/IMG_2690_vfuzyw.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -1.8, caption: 'City strolls',                  date: 'Summer 2023',  location: 'Chicago' },
  // Fall 2023
  { id: 2,  src: `${BASE}/v1775101700/IMG_4242_zwccs4.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -0.3, caption: 'Chicago marathon PR moment',     date: 'Fall 2023',    location: 'Chicago' },
  { id: 3,  src: `${BASE}/v1775101698/IMG_3232_gltej3.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 0.5,  caption: 'Our first trip to NYC',          date: 'Fall 2023',    location: 'Central Park' },
  // Winter 2023
  { id: 4,  src: `${BASE}/v1775101707/5DA76A8F-2231-43E9-8528-5E7F96060D5B_t4me68.jpg`, alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 0.5,  caption: 'Our first big trip',             date: 'Winter 2023',  location: 'Vienna' },
  { id: 5,  src: `${BASE}/v1775101699/IMG_4053_nxk7lf.jpg`,                              alt: 'Eugenie and Alex', aspect: 'square',    rotate: 1.8,  caption: 'Exploring',                      date: 'Winter 2023',  location: 'Vienna' },
  { id: 6,  src: `${BASE}/v1775101699/IMG_3890_eces2a.jpg`,                              alt: 'Eugenie and Alex', aspect: 'landscape', rotate: -1.2, caption: 'Christmas markets',              date: 'Winter 2023',  location: 'Vienna' },
  { id: 7,  src: `${BASE}/v1775101698/IMG_3695_bllxvy.jpg`,                              alt: 'Eugenie and Alex', aspect: 'landscape', rotate: 2.2,  caption: 'Our first trip to Paris',        date: 'Winter 2023',  location: 'Paris' },
  // Spring 2024
  { id: 8,  src: `${BASE}/v1775101713/F1F0B608-E58D-4054-BBB3-BCB4C87921EB_k2msml.jpg`, alt: 'Eugenie and Alex', aspect: 'landscape', rotate: 1.5,  caption: 'Birthday girl',                  date: 'Spring 2024',  location: 'New York' },
  { id: 9,  src: `${BASE}/v1775101704/IMG_7507_sajxkn.jpg`,                              alt: 'Eugenie and Alex', aspect: 'square',    rotate: -0.8, caption: 'Penn',                           date: 'Spring 2024',  location: 'Philadelphia' },
  { id: 10, src: `${BASE}/v1775101703/IMG_6216_mzwgyn.jpg`,                              alt: 'Eugenie and Alex', aspect: 'landscape', rotate: -1,   caption: 'City strolls',                   date: 'Spring 2024',  location: 'Chicago' },
  { id: 11, src: `${BASE}/v1775101702/IMG_5783_sbssfd.jpg`,                              alt: 'Eugenie and Alex', aspect: 'square',    rotate: -1.5, caption: 'Wedding guests',                 date: 'Spring 2024',  location: 'Berkshires' },
  { id: 12, src: `${BASE}/v1775101701/IMG_5246_mvcttw.jpg`,                              alt: 'Eugenie and Alex', aspect: 'square',    rotate: 0.3,  caption: 'Alex\'s 30th',                   date: 'Spring 2024',  location: 'Chicago' },
  // Summer 2024
  { id: 13, src: `${BASE}/v1775101703/IMG_7018_x7zpm4.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 1.2,  caption: 'Paris Olympics',                  date: 'Summer 2024',  location: 'Paris' },
  { id: 14, src: `${BASE}/v1775101702/IMG_6063_tq2czt.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 2.5,  caption: 'Move-in day!',                   date: 'Summer 2024',  location: 'Chicago' },
  // Fall 2024
  { id: 15, src: `${BASE}/v1775101714/IMG_7967_vevdya.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -1.2, caption: 'The day we got engaged!',        date: 'Fall 2024',    location: 'New York' },
  { id: 16, src: `${BASE}/v1775101704/IMG_7995_kz0qjn.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 2.2,  caption: 'Post engagement glow',           date: 'Fall 2024',    location: 'Central Park' },
  { id: 17, src: `${BASE}/v1775101696/IMG_0219_pkovbz.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 2,    caption: 'Just engaged!',                  date: 'Fall 2024',    location: 'New York' },
  { id: 18, src: `${BASE}/v1775670469/DSC_6548_tvfh36.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 1.5,  caption: 'The proposal spot!',             date: 'Fall 2024',    location: 'Central Park' },
  { id: 19, src: `${BASE}/v1775670649/DSC_6771_fzqhea.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -1,   caption: 'Just engaged',                   date: 'Fall 2024',    location: 'Central Park' },
  { id: 20, src: `${BASE}/v1775670869/DSC_6757_t7zae6.jpg`,                              alt: 'Eugenie and Alex', aspect: 'landscape', rotate: 0.8,  caption: 'Engaged!',                       date: 'Fall 2024',    location: 'Central Park' },
  // Winter 2024
  { id: 21, src: `${BASE}/v1775101714/IMG_8458_dxyje6.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 0.8,  caption: 'We love wigs',                   date: 'Winter 2024',  location: 'Chicago' },
  { id: 22, src: `${BASE}/v1775101711/94365BAF-5C14-48C5-88C3-0FD621968458_bn8uzx.jpg`, alt: 'Eugenie and Alex', aspect: 'square',    rotate: -2.2, caption: 'Cold faces, warm hearts',        date: 'Winter 2024',  location: 'Chicago' },
  { id: 23, src: `${BASE}/v1775101705/IMG_8781_w9ztqp.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -1.8, caption: 'Hooked the big one',             date: 'Winter 2024',  location: 'North Carolina' },
  { id: 24, src: `${BASE}/v1775101701/IMG_5151_p76jvc.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -2.5, caption: 'Beach getaway',                  date: 'Winter 2024',  location: 'Cancun' },
  { id: 25, src: `${BASE}/v1775101700/IMG_4395_qzdycz.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 1,    caption: 'Murder mystery',                 date: 'Winter 2024',  location: 'Chicago' },
  // Spring 2025
  { id: 26, src: `${BASE}/v1775101697/IMG_0842_uefoq7.jpg`,                              alt: 'Eugenie and Alex', aspect: 'square',    rotate: 1.2,  caption: 'Japan memories',                 date: 'Spring 2025',  location: 'Tokyo' },
  { id: 27, src: `${BASE}/v1775101697/IMG_1580_ahagsj.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -0.5, caption: 'Birthday celebrations!',         date: 'Spring 2025',  location: 'Chicago' },
  { id: 28, src: `${BASE}/v1775101696/IMG_0180_qnasym.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -2,   caption: 'Japan trip',                     date: 'Spring 2025',  location: 'Tokyo' },
  // Summer 2025
  { id: 29, src: `${BASE}/v1775101986/IMG_2726_otd1x5.jpg`,                              alt: 'Eugenie and Alex', aspect: 'square',    rotate: -1.5, caption: 'Golden hour',                    date: 'Summer 2025',  location: 'Puglia, Italy' },
  { id: 30, src: `${BASE}/v1775101977/IMG_2268_vz97cq.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: 2,    caption: 'Tennis fiends',                  date: 'Summer 2025',  location: 'Chicago' },
  // Winter 2025
  { id: 31, src: `${BASE}/v1775101963/IMG_4539_x4c1wg.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -0.5, caption: 'Showing Alex around Brussels',   date: 'Winter 2025',  location: 'Brussels' },
  { id: 32, src: `${BASE}/v1775101962/IMG_4196_qpe89m.jpg`,                              alt: 'Eugenie and Alex', aspect: 'square',    rotate: 1.8,  caption: 'Blizzard babes',                 date: 'Winter 2025',  location: 'Chicago' },
  // Spring 2026
  { id: 33, src: `${BASE}/v1775101940/IMG_0012_maoq6p.jpg`,                              alt: 'Eugenie and Alex', aspect: 'tall',      rotate: -2,   caption: 'Showered with love!',            date: 'Spring 2026',  location: 'Chicago' },
]

const aspectClasses: Record<string, string> = {
  tall:      'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square:    'aspect-square',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface FloatingHeart {
  id: number
  x: number
  y: number
}

export default function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [shuffled] = useState(() => shuffle(photos))
  const [hearts, setHearts] = useState<FloatingHeart[]>([])
  const directionRef = useRef(0)
  const heartIdRef = useRef(0)

  const close = useCallback(() => setSelected(null), [])

  const prev = useCallback(() => {
    directionRef.current = -1
    setSelected((i) => (i === null ? null : (i - 1 + shuffled.length) % shuffled.length))
  }, [shuffled.length])

  const next = useCallback(() => {
    directionRef.current = 1
    setSelected((i) => (i === null ? null : (i + 1) % shuffled.length))
  }, [shuffled.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')      close()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, prev, next])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const id = heartIdRef.current++
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setHearts((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
  }, [])

  const removeHeart = useCallback((id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const selectedPhoto = selected !== null ? shuffled[selected] : null

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
          Our Story
        </motion.h1>
        <motion.p
          className="font-serif text-sm tracking-[0.2em] uppercase"
          style={{ color: '#722F37', opacity: 0.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          A few of our favourite moments
        </motion.p>
        <motion.div
          className="mx-auto h-px w-16"
          style={{ backgroundColor: '#C5A258' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </section>

      {/* Masonry grid */}
      <section className="mx-auto max-w-6xl px-4 pb-32 sm:px-6 overflow-hidden">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {shuffled.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="break-inside-avoid mb-5 cursor-pointer group"
              style={{ rotate: photo.rotate }}
              initial={{ opacity: 0, y: 30, rotate: photo.rotate * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: photo.rotate }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.04 * (i % 5) }}
              whileHover={{ rotate: 0, scale: 1.03, transition: { duration: 0.3 } }}
              onClick={() => { directionRef.current = 0; setSelected(i) }}
              onDoubleClick={handleDoubleClick}
            >
              <div
                className="relative bg-white p-2 pb-8 rounded-sm shadow-md transition-shadow duration-300 group-hover:shadow-xl"
              >
                <div className={`relative w-full ${aspectClasses[photo.aspect]} overflow-hidden`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {/* Caption area (Polaroid bottom) */}
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-1.5 pt-1 flex items-center justify-center min-h-[1.75rem]">
                  <span
                    className="script text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate"
                    style={{ color: '#722F37' }}
                  >
                    {photo.caption}
                  </span>
                </div>
                {/* Floating hearts */}
                <AnimatePresence>
                  {hearts.map((heart) => (
                    <motion.div
                      key={heart.id}
                      className="absolute pointer-events-none"
                      style={{ left: heart.x, top: heart.y }}
                      initial={{ opacity: 1, scale: 0.5, y: 0 }}
                      animate={{ opacity: 0, scale: 1.2, y: -80 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      onAnimationComplete={() => removeHeart(heart.id)}
                    >
                      <Heart size={20} fill="#722F37" color="#722F37" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence mode="wait">
        {selectedPhoto && selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(20, 10, 12, 0.92)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            {/* Photo + caption */}
            <AnimatePresence mode="wait" custom={directionRef.current}>
              <motion.div
                key={selected}
                className="relative flex flex-col items-center max-h-[90vh] max-w-[90vw] sm:max-w-3xl"
                custom={directionRef.current}
                initial={(dir: number) => ({ x: dir * 60, opacity: 0, scale: 0.95 })}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={(dir: number) => ({ x: dir * -60, opacity: 0, scale: 0.95 })}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  width={1000}
                  height={1200}
                  className="max-h-[70vh] w-auto object-contain rounded-sm shadow-2xl"
                  priority
                />
                {/* Caption block */}
                <motion.div
                  className="mt-4 text-center max-w-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  {selectedPhoto.caption && (
                    <p className="script text-2xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      {selectedPhoto.caption}
                    </p>
                  )}
                  {(selectedPhoto.location || selectedPhoto.date) && (
                    <p
                      className="mt-1 font-serif text-xs tracking-[0.2em] uppercase"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {[selectedPhoto.location, selectedPhoto.date].filter(Boolean).join('  \u00b7  ')}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Close */}
            <button
              className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
              onClick={close}
              aria-label="Close"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            {/* Prev / Next */}
            <button
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={36} strokeWidth={1.2} />
            </button>
            <button
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next photo"
            >
              <ChevronRight size={36} strokeWidth={1.2} />
            </button>

            {/* Counter */}
            <p
              className="absolute bottom-5 left-1/2 -translate-x-1/2 font-serif text-xs tracking-widest"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {selected + 1} / {shuffled.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
