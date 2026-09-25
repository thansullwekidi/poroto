'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import toast from 'react-hot-toast'
import type { Education } from '@/types'

const emptyForm: Partial<Education> = {
  institution: '', program: '', description: '', start_year: undefined, end_year: undefined,
  current: true, logo_url: null, display_order: 0, published: true
}

export default function AdminEducationPage() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Education>>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchItems = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('education').select('*').order('display_order')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const openAdd = () => { setForm({ ...emptyForm, display_order: items.length }); setEditingId(null); setShowForm(true) }
  const openEdit = (item: Education) => { setForm(item); setEditingId(item.id); setShowForm(true) }

  const handleSave = async () => {
    if (!form.institution?.trim() || !form.program?.trim()) { toast.error('Institusi dan Program wajib diisi.'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      if (editingId) {
        const { id, created_at, ...rest } = form as Education
        await supabase.from('education').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', editingId)
        toast.success('Pendidikan diperbarui!')
      } else {
        await supabase.from('education').insert({ ...form })
        toast.success('Pendidikan ditambahkan!')
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
      await supabase.from('education').delete().eq('id', deleteId)
      toast.success('Pendidikan dihapus!')
      setDeleteId(null); fetchItems()
    } catch { toast.error('Gagal menghapus.') }
    finally { setDeleting(false) }
  }

  const togglePublish = async (item: Education) => {
    const supabase = createClient()
    await supabase.from('education').update({ published: !item.published }).eq('id', item.id)
    fetchItems()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Education</h1><p className="text-gray-400 text-sm mt-1">{items.length} riwayat pendidikan</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah Pendidikan</button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">{editingId ? 'Edit Pendidikan' : 'Tambah Pendidikan'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Institusi *</label>
              <input value={form.institution || ''} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="UIN Sultan Maulana Hasanuddin Banten"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Program Studi *</label>
              <input value={form.program || ''} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder="Program Studi Informatika"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tahun Mulai</label>
              <input type="number" value={form.start_year || ''} onChange={(e) => setForm({ ...form, start_year: e.target.value ? Number(e.target.value) : undefined })} placeholder="2022"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tahun Selesai</label>
              <input type="number" value={form.end_year || ''} onChange={(e) => setForm({ ...form, end_year: e.target.value ? Number(e.target.value) : undefined })} placeholder="2026" disabled={form.current}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-40" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.current ?? true} onChange={(e) => setForm({ ...form, current: e.target.checked, end_year: e.target.checked ? undefined : form.end_year })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
            <span className="text-sm text-gray-300">Masih berjalan</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
            <textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi program studi..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
          </div>
          <ImageUpload value={form.logo_url || null} onChange={(url) => setForm({ ...form, logo_url: url })} bucket="logos" folder="education" label="Logo Institusi" aspectRatio="square" />
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
        <div className="text-center py-16 glass rounded-2xl"><p className="text-gray-500">Belum ada riwayat pendidikan.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`glass rounded-xl p-4 flex items-center gap-4 ${!item.published ? 'opacity-60' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{item.institution}</span>
                  {item.current && <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">Aktif</span>}
                  {!item.published && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">Draft</span>}
                </div>
                <p className="text-cyan-400 text-sm">{item.program}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.start_year} – {item.current ? 'Sekarang' : item.end_year}</p>
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

      <DeleteConfirmDialog open={!!deleteId} description="Hapus riwayat pendidikan ini?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
