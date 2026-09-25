'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import type { Education } from '@/types'
import { formatPeriod } from '@/lib/utils'

interface EducationSectionProps {
  education: Education[]
}

export default function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null

  return (
    <section id="education" className="section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Pendidikan</span>
          <h2 className="section-title mt-2">Riwayat Pendidikan</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="flex items-start gap-4">
                {edu.logo_url ? (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white p-1">
                    <Image src={edu.logo_url} alt={edu.institution} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <GraduationCap size={28} className="text-cyan-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-white">{edu.institution}</h3>
                  <p className="text-cyan-400 text-sm mt-1">{edu.program}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatPeriod(edu.start_year, edu.end_year, edu.current)}
                  </p>
                </div>
              </div>
              {edu.description && (
                <p className="text-gray-400 text-sm leading-relaxed mt-4">{edu.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
