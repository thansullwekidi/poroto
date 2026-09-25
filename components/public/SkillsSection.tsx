'use client'

import { motion } from 'framer-motion'
import type { Skill } from '@/types'

interface SkillsSectionProps {
  skills: Skill[]
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  if (skills.length === 0) return null

  return (
    <section id="skills" className="section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Keahlian</span>
          <h2 className="section-title mt-2">Teknologi & Tools</h2>
          <p className="section-subtitle mx-auto">
            Berbagai teknologi dan alat yang saya gunakan dalam pekerjaan sehari-hari.
          </p>
        </motion.div>

        <div className="space-y-12">
          {categories.map((category, catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                {category}
                <span className="h-px flex-1 bg-gradient-to-l from-cyan-500/50 to-transparent" />
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill, idx) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="glass rounded-xl p-4 text-center card-hover cursor-default"
                    >
                      {skill.icon_url ? (
                        <img
                          src={skill.icon_url}
                          alt={skill.name}
                          className="w-10 h-10 mx-auto mb-3 object-contain"
                        />
                      ) : (
                        <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <span className="text-cyan-400 text-xs font-bold">
                            {skill.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-200">{skill.name}</p>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
