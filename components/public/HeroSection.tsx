'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import type { Hero, Profile } from '@/types'

interface HeroSectionProps {
  hero: Hero | null
  profile: Profile | null
}

export default function HeroSection({ hero, profile }: HeroSectionProps) {
  const greeting = hero?.greeting || 'Halo, Saya'
  const name = hero?.name || 'Muhammad Sulthan Fajri Rabbani'
  const headline = hero?.headline || 'Graphic Designer & Informatics Student'
  const subtitle = hero?.subtitle || ''
  const description = hero?.description || ''
  const profileImage = hero?.profile_image_url || profile?.photo_url
  const primaryBtnText = hero?.primary_button_text || 'Lihat Portfolio'
  const primaryBtnUrl = hero?.primary_button_url || '#projects'
  const secondaryBtnText = hero?.secondary_button_text || 'Hubungi Saya'
  const secondaryBtnUrl = hero?.secondary_button_url || '#contact'

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.p
              className="text-cyan-400 font-medium mb-3 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {greeting}
            </motion.p>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {name}
            </motion.h1>

            <motion.h2
              className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {headline}
            </motion.h2>

            {subtitle && (
              <motion.p
                className="text-gray-400 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}

            {description && (
              <motion.p
                className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {description}
              </motion.p>
            )}

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href={primaryBtnUrl} className="btn-primary">
                {primaryBtnText}
              </Link>
              <Link href={secondaryBtnUrl} className="btn-secondary">
                {secondaryBtnText}
              </Link>
            </motion.div>
          </motion.div>

          {/* Profile image */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-cyan-500/30">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <span className="text-6xl font-bold text-cyan-400/50">
                      {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              {/* Decorative rings */}
              <div className="absolute -inset-4 border border-cyan-500/10 rounded-full" />
              <div className="absolute -inset-8 border border-cyan-500/5 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={24} className="text-gray-500" />
        </motion.div>
      </div>
    </section>
  )
}
