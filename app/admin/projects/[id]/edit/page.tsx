'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Plus, X, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'
import { generateSlug } from '@/lib/utils'
import type { Project, ProjectImage } from '@/types'
import { PROJECT_CATEGORIES } from '@/types'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const [form, setForm] = useState<Partial<Project>>({})
  const [gallery, setGallery] = useState<ProjectImage[]>([])
  const [toolInput, setToolInput] = useState('')
  const [techInput, setTechInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('projects').select('*, project_images(*)').eq('id', projectId).single()
      if (data) {
        const { project_images, ...rest } = data
        setForm(rest)
        setGallery(project_images?.sort((a: ProjectImage, b: ProjectImage) => a.display_order - b.display_order) || [])
      }
      setLoading(false)
    }
    fetch()
  }, [projectId])

  const addTag = (field: 'tools' | 'technologies', value: string) => {
    if (!value.trim()) return
    const current = (form[field] as string[]) || []
    if (!current.includes(value.trim())) setForm({ ...form, [field]: [...current, value.trim()] })
    if (field === 'tools') setToolInput('')
    else setTechInput('')
  }

  const removeTag = (field: 'tools' | 'technologies', tag: string) => {
    setForm({ ...form, [field]: ((form[field] as string[]) || []).filter((t) => t !== tag) })
  }

  const addGalleryImage = async (url: string | null) => {
    if (!url) return
    const supabase = createClient()
    const { data } = await supabase.from('project_images').insert({
      project_id: projectId, image_url: url, display_order: gallery.length
    }).select().single()
    if (data) setGallery([...gallery, data])
    toast.success('Gambar galeri ditambahkan!')
  }

  const removeGalleryImage = async (imageId: string) => {
    const supabase = createClient()
    await supabase.from('project_images').delete().eq('id', imageId)
    setGallery(gallery.filter((g) => g.id !== imageId))
    toast.success('Gambar dihapus.')
  }

  const handleSave = async (publishStatus?: boolean) => {
    if (!form.title?.trim()) { toast.error('Judul project wajib diisi.'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      const { id, created_at, project_images: _pi, ...rest } = form as Project & { project_images?: unknown }
      const updateData = { ...rest, updated_at: new Date().toISOString() }
      if (publishStatus !== undefined) updateData.published = publishStatus
      await supabase.from('projects').update(updateData).eq('id', projectId)
      toast.success('Project berhasil disimpan!')
      router.push('/admin/projects')
    } catch { toast.error('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Project</h1>
          <p className="text-gray-400 text-sm mt-1">{form.title}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Judul Project *</label>
              <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
              <p className="text-xs text-gray-500 mb-2">URL: /projects/<span className="text-cyan-400">{form.slug}</span></p>
              <input value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Singkat</label>
              <textarea rows={3} value={form.short_description || ''} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Lengkap</label>
              <textarea rows={8} value={form.full_description || ''} onChange={(e) => setForm({ ...form, full_description: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
            </div>
          </div>

          {/* Gallery */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Galeri Gambar</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {gallery.map((img) => (
                <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-800">
                  <Image src={img.image_url} alt="Gallery" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => removeGalleryImage(img.id)} className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <ImageUpload value={null} onChange={addGalleryImage} bucket="project-images" folder="gallery" label="Tambah Gambar ke Galeri" aspectRatio="video" />
          </div>

          {/* Tools */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Tools & Teknologi</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tools</label>
              <div className="flex gap-2 mb-2">
                <input value={toolInput} onChange={(e) => setToolInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('tools', toolInput))} placeholder="Tambah tool..." className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm" />
                <button type="button" onClick={() => addTag('tools', toolInput)} className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"><Plus size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {((form.tools as string[]) || []).map((tool) => (
                  <span key={tool} className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 text-gray-300 text-xs">
                    {tool}<button type="button" onClick={() => removeTag('tools', tool)} className="hover:text-red-400"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Teknologi</label>
              <div className="flex gap-2 mb-2">
                <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('technologies', techInput))} placeholder="Tambah teknologi..." className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm" />
                <button type="button" onClick={() => addTag('technologies', techInput)} className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"><Plus size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {((form.technologies as string[]) || []).map((tech) => (
                  <span key={tech} className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
                    {tech}<button type="button" onClick={() => removeTag('technologies', tech)} className="hover:text-red-400"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Links</h3>
            {[['GitHub URL', 'github_url', 'https://github.com/...'], ['Live Demo URL', 'live_url', 'https://...'], ['Link Eksternal', 'external_url', 'https://...']].map(([label, key, placeholder]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                <input value={(form as Record<string, string | null>)[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value || null })} placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-white">Status</h3>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800">
              <div className={`w-2 h-2 rounded-full ${form.published ? 'bg-green-400' : 'bg-gray-500'}`} />
              <span className="text-sm text-gray-300">{form.published ? 'Published' : 'Draft'}</span>
            </div>
            <button onClick={() => handleSave()} disabled={saving} className="btn-primary w-full justify-center">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button onClick={() => handleSave(!form.published)} disabled={saving} className="btn-secondary w-full justify-center text-sm">
              {form.published ? 'Unpublish' : 'Publish'}
            </button>
            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="featured" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
              <label htmlFor="featured" className="text-sm text-gray-300 cursor-pointer">Featured</label>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-white">Detail</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
              <select value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                {PROJECT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal Project</label>
              <input type="date" value={form.project_date || ''} onChange={(e) => setForm({ ...form, project_date: e.target.value || null })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
              <input value={form.client || ''} onChange={(e) => setForm({ ...form, client: e.target.value || null })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4">Thumbnail</h3>
            <ImageUpload value={form.thumbnail_url || null} onChange={(url) => setForm({ ...form, thumbnail_url: url })} bucket="project-images" folder="thumbnails" label="" aspectRatio="video" />
          </div>
        </div>
      </div>
    </div>
  )
}
