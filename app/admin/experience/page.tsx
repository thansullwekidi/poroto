'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import toast from 'react-hot-toast'
import type { Experience } from '@/types'

const emptyForm: Partial<Experience> = {
  position: '', organization: '', description: '', start_date: null, end_date: null,
  current: false, logo_url: null, display_order: 0, published: true
}

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Experience>>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchItems = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('experiences').select('*').order('display_order')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const openAdd = () => { setForm({ ...emptyForm, display_order: items.length }); setEditingId(null); setShowForm(true) }
  const openEdit = (item: Experience) => { setForm(item); setEditingId(item.id); setShowForm(true) }

  const handleSave = async () => {
    if (!form.position?.trim() || !form.organization?.trim()) { toast.error('Posisi dan Organisasi wajib diisi.'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      if (editingId) {
        const { id, created_at, ...rest } = form as Experience
        await supabase.from('experiences').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', editingId)
        toast.success('Pengalaman diperbarui!')
      } else {
        await supabase.from('experiences').insert({ ...form })
        toast.success('Pengalaman ditambahkan!')
      }
      setShowForm(false); fetchItems()
    } catch { toast.error('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('experiences').delete().eq('id', deleteId)
      toast.success('Pengalaman dihapus!')
      setDeleteId(null); fetchItems()
    } catch { toast.error('Gagal menghapus.') }
    finally { setDeleting(false) }
  }

  const togglePublish = async (item: Experience) => {
    const supabase = createClient()
    await supabase.from('experiences').update({ published: !item.published }).eq('id', item.id)
    fetchItems()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Experience</h1><p className="text-gray-400 text-sm mt-1">{items.length} pengalaman terdaftar</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah Pengalaman</button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">{editingId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Posisi / Jabatan *</label>
              <input value={form.position || ''} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Graphic Designer"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Organisasi / Perusahaan *</label>
              <input value={form.organization || ''} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Nama perusahaan..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal Mulai</label>
              <input type="date" value={form.start_date || ''} onChange={(e) => setForm({ ...form, start_date: e.target.value || null })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal Selesai</label>
              <input type="date" value={form.end_date || ''} onChange={(e) => setForm({ ...form, end_date: e.target.value || null })} disabled={form.current}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-40" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.current ?? false} onChange={(e) => setForm({ ...form, current: e.target.checked, end_date: e.target.checked ? null : form.end_date })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
            <span className="text-sm text-gray-300">Masih berlangsung (Sekarang)</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
            <textarea rows={4} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi tanggung jawab dan pencapaian..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
          </div>
          <ImageUpload value={form.logo_url || null} onChange={(url) => setForm({ ...form, logo_url: url })} bucket="logos" folder="experience" label="Logo Organisasi" aspectRatio="square" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
            <span className="text-sm text-gray-300">Published</span>
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm">Batal</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl"><p className="text-gray-500">Belum ada pengalaman.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`glass rounded-xl p-4 flex items-center gap-4 ${!item.published ? 'opacity-60' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{item.position}</span>
                  {item.current && <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">Sekarang</span>}
                  {!item.published && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">Draft</span>}
                </div>
                <p className="text-cyan-400 text-sm">{item.organization}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => togglePublish(item)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                  {item.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400 transition-colors"><Pencil size={16} /></button>
                <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmDialog open={!!deleteId} description="Hapus pengalaman ini?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
