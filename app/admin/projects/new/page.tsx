'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'
import { generateSlug } from '@/lib/utils'
import type { ProjectInput } from '@/types'
import { PROJECT_CATEGORIES } from '@/types'

const empty: ProjectInput = {
  title: '', slug: '', category: 'Graphic Design', short_description: '', full_description: '',
  thumbnail_url: null, project_date: null, client: null, tools: [], technologies: [],
  github_url: null, live_url: null, external_url: null, featured: false, published: false, display_order: 0,
}

export default function NewProjectPage() {
  const router = useRouter()
  const [form, setForm] = useState<ProjectInput>(empty)
  const [toolInput, setToolInput] = useState('')
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)

  const handleTitleChange = (title: string) => {
    setForm({ ...form, title, slug: form.slug || generateSlug(title) })
  }

  const addTag = (field: 'tools' | 'technologies', value: string) => {
    if (!value.trim()) return
    const current = form[field] || []
    if (!current.includes(value.trim())) {
      setForm({ ...form, [field]: [...current, value.trim()] })
    }
    if (field === 'tools') setToolInput('')
    else setTechInput('')
  }

  const removeTag = (field: 'tools' | 'technologies', tag: string) => {
    setForm({ ...form, [field]: (form[field] || []).filter((t) => t !== tag) })
  }

  const handleSave = async (publish = false) => {
    if (!form.title.trim()) { toast.error('Judul project wajib diisi.'); return }
    if (!form.slug.trim()) { toast.error('Slug wajib diisi.'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('projects').insert({ ...form, published: publish }).select('id').single()
      if (error) {
        if (error.code === '23505') toast.error('Slug sudah digunakan. Gunakan slug yang berbeda.')
        else throw error
        return
      }
      toast.success(publish ? 'Project berhasil dipublish!' : 'Project disimpan sebagai draft!')
      router.push('/admin/projects')
    } catch { toast.error('Gagal menyimpan project.') }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Tambah Project Baru</h1>
          <p className="text-gray-400 text-sm mt-1">Isi semua informasi project</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Judul Project *</label>
              <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Nama project Anda"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Slug *</label>
              <p className="text-xs text-gray-500 mb-2">URL: /projects/<span className="text-cyan-400">{form.slug || 'slug-project'}</span></p>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })} placeholder="nama-project"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Singkat</label>
              <textarea rows={3} value={form.short_description || ''} onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                placeholder="Ringkasan singkat project (tampil di card)"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Lengkap</label>
              <textarea rows={8} value={form.full_description || ''} onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                placeholder="Ceritakan detail tentang project ini: tujuan, proses, hasil..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
            </div>
          </div>

          {/* Tools & Technologies */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Tools & Teknologi</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tools yang Digunakan</label>
              <div className="flex gap-2 mb-2">
                <input value={toolInput} onChange={(e) => setToolInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('tools', toolInput))}
                  placeholder="Ketik tool lalu Enter..." className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm" />
                <button type="button" onClick={() => addTag('tools', toolInput)} className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"><Plus size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.tools || []).map((tool) => (
                  <span key={tool} className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 text-gray-300 text-xs">
                    {tool}
                    <button type="button" onClick={() => removeTag('tools', tool)} className="hover:text-red-400"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Teknologi</label>
              <div className="flex gap-2 mb-2">
                <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('technologies', techInput))}
                  placeholder="Ketik teknologi lalu Enter..." className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm" />
                <button type="button" onClick={() => addTag('technologies', techInput)} className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"><Plus size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.technologies || []).map((tech) => (
                  <span key={tech} className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
                    {tech}
                    <button type="button" onClick={() => removeTag('technologies', tech)} className="hover:text-red-400"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Links</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input value={form.github_url || ''} onChange={(e) => setForm({ ...form, github_url: e.target.value || null })} placeholder="https://github.com/..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Live Demo URL</label>
              <input value={form.live_url || ''} onChange={(e) => setForm({ ...form, live_url: e.target.value || null })} placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Link Eksternal Lainnya</label>
              <input value={form.external_url || ''} onChange={(e) => setForm({ ...form, external_url: e.target.value || null })} placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish actions */}
          <div className="glass rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-white">Publikasi</h3>
            <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary w-full justify-center">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Menyimpan...' : 'Publish Sekarang'}
            </button>
            <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary w-full justify-center text-sm">
              Simpan sebagai Draft
            </button>
            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
              <label htmlFor="featured" className="text-sm text-gray-300 cursor-pointer">Tandai sebagai Featured</label>
            </div>
          </div>

          {/* Category & date */}
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Client (Opsional)</label>
              <input value={form.client || ''} onChange={(e) => setForm({ ...form, client: e.target.value || null })} placeholder="Nama client"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Urutan Tampil</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4">Thumbnail</h3>
            <ImageUpload value={form.thumbnail_url} onChange={(url) => setForm({ ...form, thumbnail_url: url })} bucket="project-images" folder="thumbnails" label="" aspectRatio="video" />
          </div>
        </div>
      </div>
    </div>
  )
}
