'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import type { Experience } from '@/types'
import { formatMonthYear } from '@/lib/utils'

interface ExperienceSectionProps {
  experiences: Experience[]
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (experiences.length === 0) return null

  return (
    <section id="experience" className="section-padding bg-gray-900/30">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Perjalanan</span>
          <h2 className="section-title mt-2">Pengalaman</h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent md:left-1/2" />

          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex gap-6 md:gap-0 ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-3 h-3 rounded-full bg-cyan-500 border-2 border-gray-950 top-6 -translate-x-1/2 md:left-1/2" />

                {/* Spacer for timeline center */}
                <div className="hidden md:block md:w-1/2" />

                {/* Card */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  <div className="glass rounded-xl p-5">
                    <div className="flex items-start gap-4 mb-3">
                      {exp.logo_url ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-800">
                          <Image src={exp.logo_url} alt={exp.organization} fill className="object-contain p-1" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                          <span className="text-cyan-400 font-bold text-sm">
                            {exp.organization.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-white">{exp.position}</h3>
                        <p className="text-cyan-400 text-sm">{exp.organization}</p>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                          <Calendar size={12} />
                          <span>
                            {formatMonthYear(exp.start_date)}
                            {' – '}
                            {exp.current ? 'Sekarang' : formatMonthYear(exp.end_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
