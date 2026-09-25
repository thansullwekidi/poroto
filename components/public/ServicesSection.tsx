'use client'

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import type { Service } from '@/types'

interface ServicesSectionProps {
  services: Service[]
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null

  return (
    <section id="services" className="section-padding bg-gray-900/30">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Layanan</span>
          <h2 className="section-title mt-2">Apa yang Saya Tawarkan</h2>
          <p className="section-subtitle mx-auto">
            Solusi kreatif dan profesional untuk kebutuhan desain dan pengembangan digital Anda.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Star
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`glass rounded-2xl p-6 card-hover ${
                  service.featured ? 'border-cyan-500/30' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  <IconComponent size={24} className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                {service.description && (
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                )}
                {service.featured && (
                  <span className="inline-block mt-3 text-xs text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded-full">
                    Unggulan
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
