import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Eye, EyeOff, Star, StarOff } from 'lucide-react'
import AdminProjectActions from '@/components/admin/AdminProjectActions'

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('display_order')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">{projects?.length || 0} project terdaftar</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus size={16} /> Tambah Project
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-gray-500 mb-4">Belum ada project.</p>
          <Link href="/admin/projects/new" className="btn-primary inline-flex">
            <Plus size={16} /> Tambah Project Pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="glass rounded-xl p-4 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                {project.thumbnail_url ? (
                  <Image src={project.thumbnail_url} alt={project.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye size={16} className="text-gray-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-white">{project.title}</span>
                  {project.featured && <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Featured</span>}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${project.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {project.category && <span className="text-xs text-gray-500">{project.category}</span>}
                {project.short_description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-1">{project.short_description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/projects/${project.id}/edit`} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400 transition-colors" title="Edit">
                  <Pencil size={16} />
                </Link>
                <AdminProjectActions projectId={project.id} published={project.published} featured={project.featured} slug={project.slug} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
