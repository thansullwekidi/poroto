import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, GitBranch as Github, Eye } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Semua Project',
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('display_order')

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Semua Project</h1>
          <p className="text-gray-400">Kumpulan karya dan proyek yang telah saya kerjakan.</p>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
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
                  {project.tools && project.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tools.slice(0, 3).map((tool: string) => (
                        <span key={tool} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">{tool}</span>
                      ))}
                      {project.tools.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">+{project.tools.length - 3}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Link href={`/projects/${project.slug}`} className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                      <Eye size={14} /> Detail
                    </Link>
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        <Github size={16} />
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <Eye size={48} className="mx-auto mb-4 opacity-30" />
            <p>Belum ada project yang dipublikasikan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
