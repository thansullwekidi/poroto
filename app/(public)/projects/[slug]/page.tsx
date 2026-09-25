import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, GitBranch as Github, Calendar, User, Wrench } from 'lucide-react'
import type { Metadata } from 'next'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('title, short_description, thumbnail_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!project) return { title: 'Project Not Found' }
  return {
    title: project.title,
    description: project.short_description || '',
    openGraph: { images: project.thumbnail_url ? [project.thumbnail_url] : [] },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!project) notFound()

  const gallery = project.project_images?.sort(
    (a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order
  ) || []

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero image */}
      {project.thumbnail_url && (
        <div className="relative w-full aspect-video max-h-[500px] overflow-hidden bg-gray-900 mb-12">
          <Image src={project.thumbnail_url} alt={project.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Kembali ke Semua Project
        </Link>

        {/* Header */}
        <div className="mb-10">
          {project.category && (
            <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">{project.category}</span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">{project.title}</h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            {project.project_date && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-cyan-400" />
                <span>{formatDate(project.project_date)}</span>
              </div>
            )}
            {project.client && (
              <div className="flex items-center gap-2">
                <User size={14} className="text-cyan-400" />
                <span>{project.client}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {project.short_description && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">Tentang Project</h2>
                <p className="text-gray-300 leading-relaxed">{project.short_description}</p>
              </div>
            )}

            {project.full_description && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">Deskripsi Lengkap</h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">{project.full_description}</div>
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Galeri</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {gallery.map((img: { id: string; image_url: string; caption?: string | null }) => (
                    <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                      <Image src={img.image_url} alt={img.caption || project.title} fill className="object-cover" />
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-xs text-gray-300">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Links */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">Links</h3>
              <div className="space-y-3">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                    <Github size={16} className="text-cyan-400" /> GitHub Repository
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    <ExternalLink size={16} className="text-cyan-400" /> Live Demo
                  </a>
                )}
                {project.external_url && (
                  <a href={project.external_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    <ExternalLink size={16} className="text-cyan-400" /> Lihat Project
                  </a>
                )}
                {!project.github_url && !project.live_url && !project.external_url && (
                  <p className="text-gray-500 text-sm">Tidak ada link tersedia.</p>
                )}
              </div>
            </div>

            {/* Tools */}
            {project.tools && project.tools.length > 0 && (
              <div className="glass rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Wrench size={16} className="text-cyan-400" /> Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool: string) => (
                    <span key={tool} className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">{tool}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="glass rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">Teknologi</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string) => (
                    <span key={tech} className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-4 justify-between items-center">
          <Link href="/projects" className="btn-secondary">
            <ArrowLeft size={16} /> Semua Project
          </Link>
          <Link href="/#contact" className="btn-primary">Hubungi Saya</Link>
        </div>
      </div>
    </div>
  )
}
