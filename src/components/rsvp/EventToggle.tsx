'use client'

import { motion } from 'framer-motion'

interface Props {
  value: boolean | null
  onChange: (v: boolean) => void
  disabled?: boolean
}

export default function EventToggle({ value, onChange, disabled = false }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      <motion.button
        type="button"
        onClick={() => !disabled && onChange(true)}
        whileTap={{ scale: 0.97 }}
        disabled={disabled}
        className="flex-1 min-w-[140px] py-2.5 px-4 font-serif text-sm tracking-wide border transition-all duration-200"
        style={{
          borderColor: value === true ? '#722F37' : '#e8d5c4',
          backgroundColor: value === true ? '#722F37' : 'white',
          color: value === true ? 'white' : '#722F37',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        Joyfully accepts
      </motion.button>
      <motion.button
        type="button"
        onClick={() => !disabled && onChange(false)}
        whileTap={{ scale: 0.97 }}
        disabled={disabled}
        className="flex-1 min-w-[140px] py-2.5 px-4 font-serif text-sm tracking-wide border transition-all duration-200"
        style={{
          borderColor: value === false ? '#9c7b7b' : '#e8d5c4',
          backgroundColor: value === false ? '#f5f0f0' : 'white',
          color: value === false ? '#6b4a4a' : '#a8a29e',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        Respectfully declines
      </motion.button>
    </div>
  )
}
