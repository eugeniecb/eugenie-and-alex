'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// Placeholder photos — replace src values with your Cloudinary URLs when ready.
// Each entry controls its display size in the masonry grid via `aspect`.
const photos = [
  { id: 1,  src: 'https://picsum.photos/seed/ea01/800/1060', alt: 'Eugénie and Alex in Paris',   aspect: 'tall'      },
  { id: 2,  src: 'https://picsum.photos/seed/ea02/800/600',  alt: 'Strolling along the Seine',   aspect: 'landscape' },
  { id: 3,  src: 'https://picsum.photos/seed/ea03/700/700',  alt: 'At the Tuileries Garden',     aspect: 'square'    },
  { id: 4,  src: 'https://picsum.photos/seed/ea04/800/1060', alt: 'Dinner at a bistro',          aspect: 'tall'      },
  { id: 5,  src: 'https://picsum.photos/seed/ea05/800/550',  alt: 'Sunday morning coffee',       aspect: 'landscape' },
  { id: 6,  src: 'https://picsum.photos/seed/ea06/700/1050', alt: 'Laughing together',           aspect: 'tall'      },
  { id: 7,  src: 'https://picsum.photos/seed/ea07/700/700',  alt: 'A quiet moment',              aspect: 'square'    },
  { id: 8,  src: 'https://picsum.photos/seed/ea08/800/540',  alt: 'Rooftops of Paris',           aspect: 'landscape' },
  { id: 9,  src: 'https://picsum.photos/seed/ea09/800/1060', alt: 'The proposal',                aspect: 'tall'      },
  { id: 10, src: 'https://picsum.photos/seed/ea10/700/700',  alt: 'Walking hand in hand',        aspect: 'square'    },
  { id: 11, src: 'https://picsum.photos/seed/ea11/800/560',  alt: 'Pont des Arts',               aspect: 'landscape' },
  { id: 12, src: 'https://picsum.photos/seed/ea12/700/1050', alt: 'Golden hour',                 aspect: 'tall'      },
  { id: 13, src: 'https://picsum.photos/seed/ea13/800/600',  alt: 'Marché des Enfants Rouges',   aspect: 'landscape' },
  { id: 14, src: 'https://picsum.photos/seed/ea14/700/700',  alt: 'Rainy afternoon',             aspect: 'square'    },
  { id: 15, src: 'https://picsum.photos/seed/ea15/800/1060', alt: 'Just the two of us',          aspect: 'tall'      },
]

const aspectClasses: Record<string, string> = {
  tall:      'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square:    'aspect-square',
}

export default function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null)

  const close = useCallback(() => setSelected(null), [])

  const prev = useCallback(() => {
    setSelected((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
  }, [])

  const next = useCallback(() => {
    setSelected((i) => (i === null ? null : (i + 1) % photos.length))
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')      close()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, prev, next])

  const selectedPhoto = selected !== null ? photos[selected] : null

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
      <section className="mx-auto max-w-6xl px-4 pb-32 sm:px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="break-inside-avoid mb-3 cursor-pointer overflow-hidden rounded-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.04 * (i % 5) }}
              onClick={() => setSelected(i)}
            >
              <div className={`relative w-full ${aspectClasses[photo.aspect]} group`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: 'rgba(114, 47, 55, 0.12)' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(20, 10, 12, 0.92)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            {/* Photo */}
            <motion.div
              className="relative max-h-[85vh] max-w-[90vw] sm:max-w-3xl"
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                width={1000}
                height={1200}
                className="max-h-[85vh] w-auto object-contain rounded-sm shadow-2xl"
                priority
              />
              {/* Caption */}
              <p
                className="mt-3 text-center font-serif text-xs tracking-[0.2em] uppercase"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {selectedPhoto.alt}
              </p>
            </motion.div>

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
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {(selected ?? 0) + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
