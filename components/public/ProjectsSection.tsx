'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, GitBranch as Github, Eye } from 'lucide-react'
import type { Project } from '@/types'

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const categories = ['Semua', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))]
  const [activeCategory, setActiveCategory] = useState('Semua')

  const filtered =
    activeCategory === 'Semua'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  if (projects.length === 0) return null

  return (
    <section id="projects" className="section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Portfolio</span>
          <h2 className="section-title mt-2">Proyek Terbaru</h2>
          <p className="section-subtitle mx-auto">
            Kumpulan proyek dan karya terbaik yang telah saya kerjakan.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as string)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-gray-950'
                  : 'glass text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="glass rounded-2xl overflow-hidden card-hover group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-800">
                  {project.thumbnail_url ? (
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                      <Eye size={32} className="text-cyan-400/30" />
                    </div>
                  )}
                  {project.featured && (
                    <span className="absolute top-3 left-3 text-xs bg-cyan-500 text-gray-950 px-2 py-1 rounded-full font-semibold">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {project.category && (
                    <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">
                      {project.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-white mt-1 mb-2">{project.title}</h3>
                  {project.short_description && (
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.short_description}
                    </p>
                  )}

                  {/* Tags */}
                  {project.tools && project.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400"
                        >
                          {tool}
                        </span>
                      ))}
                      {project.tools.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                          +{project.tools.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      <Eye size={14} />
                      Detail
                    </Link>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="GitHub"
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {projects.length > 6 && (
          <div className="text-center mt-10">
            <Link href="/projects" className="btn-secondary">
              Lihat Semua Proyek
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
