'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import toast from 'react-hot-toast'
import type { Service } from '@/types'

const emptyForm: Partial<Service> = { icon: 'Star', title: '', description: '', featured: false, display_order: 0, published: true }

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Service>>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchServices = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('services').select('*').order('display_order')
    setServices(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchServices() }, [])

  const openAdd = () => { setForm({ ...emptyForm, display_order: services.length }); setEditingId(null); setShowForm(true) }
  const openEdit = (s: Service) => { setForm(s); setEditingId(s.id); setShowForm(true) }

  const handleSave = async () => {
    if (!form.title?.trim()) { toast.error('Judul layanan wajib diisi.'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      if (editingId) {
        const { id, created_at, ...rest } = form as Service
        await supabase.from('services').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', editingId)
        toast.success('Layanan diperbarui!')
      } else {
        await supabase.from('services').insert({ ...form })
        toast.success('Layanan ditambahkan!')
      }
      setShowForm(false)
      fetchServices()
    } catch { toast.error('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('services').delete().eq('id', deleteId)
      toast.success('Layanan dihapus!')
      setDeleteId(null)
      fetchServices()
    } catch { toast.error('Gagal menghapus.') }
    finally { setDeleting(false) }
  }

  const togglePublish = async (s: Service) => {
    const supabase = createClient()
    await supabase.from('services').update({ published: !s.published }).eq('id', s.id)
    fetchServices()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Services</h1><p className="text-gray-400 text-sm mt-1">{services.length} layanan terdaftar</p></div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah Layanan</button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">{editingId ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Judul Layanan *</label>
              <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Graphic Design"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Icon (Lucide name)</label>
              <input value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Palette, Code, Monitor..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
            <textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi layanan..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
              <span className="text-sm text-gray-300">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured ?? false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
              <span className="text-sm text-gray-300">Featured</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm">Batal</button>
          </div>
        </div>
      )}

      {services.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl"><p className="text-gray-500">Belum ada layanan.</p></div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className={`glass rounded-xl p-4 flex items-center gap-4 ${!s.published ? 'opacity-60' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                <span className="text-cyan-400 text-xs font-bold">{s.icon?.slice(0, 2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{s.title}</span>
                  {s.featured && <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Unggulan</span>}
                  {!s.published && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">Draft</span>}
                </div>
                {s.description && <p className="text-gray-400 text-sm line-clamp-1">{s.description}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => togglePublish(s)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                  {s.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400 transition-colors"><Pencil size={16} /></button>
                <button onClick={() => setDeleteId(s.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmDialog open={!!deleteId} description="Hapus layanan ini?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
