'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const BASE = 'https://res.cloudinary.com/dl7hw5hs5/image/upload/f_auto,q_auto'

const photos = [
  { id: 1,  src: `${BASE}/v1775101986/IMG_2726_otd1x5.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 2,  src: `${BASE}/v1775101977/IMG_2268_vz97cq.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 3,  src: `${BASE}/v1775101963/IMG_4539_x4c1wg.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 4,  src: `${BASE}/v1775101962/IMG_4196_qpe89m.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 5,  src: `${BASE}/v1775101940/IMG_0012_maoq6p.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 6,  src: `${BASE}/v1775101714/IMG_8458_dxyje6.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 7,  src: `${BASE}/v1775101714/IMG_7967_vevdya.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 8,  src: `${BASE}/v1775101713/F1F0B608-E58D-4054-BBB3-BCB4C87921EB_k2msml.jpg`, alt: 'Eugénie and Alex', aspect: 'tall' },
  { id: 9,  src: `${BASE}/v1775101711/94365BAF-5C14-48C5-88C3-0FD621968458_bn8uzx.jpg`, alt: 'Eugénie and Alex', aspect: 'tall' },
  { id: 10, src: `${BASE}/v1775101707/5DA76A8F-2231-43E9-8528-5E7F96060D5B_t4me68.jpg`, alt: 'Eugénie and Alex', aspect: 'tall' },
  { id: 11, src: `${BASE}/v1775101705/IMG_8781_w9ztqp.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 12, src: `${BASE}/v1775101704/IMG_7995_kz0qjn.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 13, src: `${BASE}/v1775101704/IMG_7507_sajxkn.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 14, src: `${BASE}/v1775101703/IMG_7018_x7zpm4.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 15, src: `${BASE}/v1775101703/IMG_6216_mzwgyn.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 16, src: `${BASE}/v1775101702/IMG_6063_tq2czt.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 17, src: `${BASE}/v1775101702/IMG_5783_sbssfd.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 18, src: `${BASE}/v1775101701/IMG_5246_mvcttw.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 19, src: `${BASE}/v1775101701/IMG_5151_p76jvc.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 20, src: `${BASE}/v1775101700/IMG_4395_qzdycz.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 21, src: `${BASE}/v1775101700/IMG_4242_zwccs4.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 22, src: `${BASE}/v1775101699/IMG_4053_nxk7lf.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 23, src: `${BASE}/v1775101699/IMG_3890_eces2a.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 24, src: `${BASE}/v1775101698/IMG_3695_bllxvy.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 25, src: `${BASE}/v1775101698/IMG_3232_gltej3.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 26, src: `${BASE}/v1775101698/IMG_2690_vfuzyw.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 27, src: `${BASE}/v1775101697/IMG_0842_uefoq7.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 28, src: `${BASE}/v1775101697/IMG_1580_ahagsj.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 29, src: `${BASE}/v1775101696/IMG_0219_pkovbz.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
  { id: 30, src: `${BASE}/v1775101696/IMG_0180_qnasym.jpg`,                        alt: 'Eugénie and Alex', aspect: 'tall'      },
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
