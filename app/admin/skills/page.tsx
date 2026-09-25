'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, GripVertical, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import toast from 'react-hot-toast'
import type { Skill } from '@/types'
import { SKILL_CATEGORIES } from '@/types'

const emptyForm: Partial<Skill> = {
  name: '',
  category: 'Design',
  icon_name: '',
  description: '',
  display_order: 0,
  published: true,
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Skill>>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [filterCategory, setFilterCategory] = useState('Semua')

  const fetchSkills = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('skills').select('*').order('display_order')
    setSkills(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchSkills() }, [])

  const openAdd = () => {
    setForm({ ...emptyForm, display_order: skills.length })
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (skill: Skill) => {
    setForm(skill)
    setEditingId(skill.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name?.trim()) { toast.error('Nama skill wajib diisi.'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      if (editingId) {
        const { id, created_at, ...rest } = form as Skill
        await supabase.from('skills').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', editingId)
        toast.success('Skill berhasil diperbarui!')
      } else {
        await supabase.from('skills').insert({ ...form })
        toast.success('Skill berhasil ditambahkan!')
      }
      setShowForm(false)
      fetchSkills()
    } catch { toast.error('Gagal menyimpan skill.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('skills').delete().eq('id', deleteId)
      toast.success('Skill berhasil dihapus!')
      setDeleteId(null)
      fetchSkills()
    } catch { toast.error('Gagal menghapus skill.') }
    finally { setDeleting(false) }
  }

  const togglePublish = async (skill: Skill) => {
    const supabase = createClient()
    await supabase.from('skills').update({ published: !skill.published }).eq('id', skill.id)
    fetchSkills()
  }

  const categories = ['Semua', ...Array.from(new Set(skills.map((s) => s.category)))]
  const filtered = filterCategory === 'Semua' ? skills : skills.filter((s) => s.category === filterCategory)

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Skills</h1>
          <p className="text-gray-400 text-sm mt-1">{skills.length} skill terdaftar</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah Skill</button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterCategory === cat ? 'bg-cyan-500 text-gray-950 font-medium' : 'glass text-gray-400 hover:text-white'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{editingId ? 'Edit Skill' : 'Tambah Skill Baru'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nama Skill *</label>
              <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Adobe Illustrator"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
              <input type="text" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Programming, Design, Marketing..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nama Icon (Lucide)</label>
              <input value={form.icon_name || ''} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} placeholder="Palette, Code, Figma..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Urutan Tampil</label>
              <input type="number" value={form.display_order || 0} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi (Opsional)</label>
              <input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi singkat skill..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
              <span className="text-sm text-gray-300">Published (tampil di website)</span>
            </label>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm">Batal</button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <p className="text-gray-500">Belum ada skill. Klik &quot;Tambah Skill&quot; untuk memulai.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((skill) => (
            <div key={skill.id} className={`glass rounded-xl p-4 flex items-start gap-3 ${!skill.published ? 'opacity-50' : ''}`}>
              <GripVertical size={16} className="text-gray-600 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm">{skill.name}</span>
                  {!skill.published && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">Draft</span>}
                </div>
                <span className="text-xs text-cyan-400">{skill.category}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => togglePublish(skill)} className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" title={skill.published ? 'Unpublish' : 'Publish'}>
                  {skill.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400 transition-colors"><Pencil size={14} /></button>
                <button onClick={() => setDeleteId(skill.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deleteId}
        description="Apakah Anda yakin ingin menghapus skill ini?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
