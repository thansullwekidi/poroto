'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import toast from 'react-hot-toast'
import type { Navigation } from '@/types'

const emptyForm: Partial<Navigation> = { label: '', url: '', display_order: 0, published: true }

export default function AdminNavigationPage() {
  const [navs, setNavs] = useState<Navigation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Navigation>>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchNavs = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('navigation').select('*').order('display_order')
    setNavs(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchNavs() }, [])

  const openAdd = () => { setForm({ ...emptyForm, display_order: navs.length }); setEditingId(null); setShowForm(true) }
  const openEdit = (n: Navigation) => { setForm(n); setEditingId(n.id); setShowForm(true) }

  const handleSave = async () => {
    if (!form.label?.trim() || !form.url?.trim()) { toast.error('Label dan URL wajib diisi.'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      if (editingId) {
        const { id, created_at, ...rest } = form as Navigation
        await supabase.from('navigation').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', editingId)
        toast.success('Menu diperbarui!')
      } else {
        await supabase.from('navigation').insert({ ...form })
        toast.success('Menu ditambahkan!')
      }
      setShowForm(false)
      fetchNavs()
    } catch { toast.error('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('navigation').delete().eq('id', deleteId)
      toast.success('Menu dihapus!')
      setDeleteId(null)
      fetchNavs()
    } catch { toast.error('Gagal menghapus.') }
    finally { setDeleting(false) }
  }

  const togglePublish = async (n: Navigation) => {
    const supabase = createClient()
    await supabase.from('navigation').update({ published: !n.published }).eq('id', n.id)
    fetchNavs()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Navigation</h1>
          <p className="text-gray-400 text-sm mt-1">Kelola menu navigasi di header website</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah Menu</button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-cyan-500/20 space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">{editingId ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Label Menu *</label>
              <input value={form.label || ''} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Beranda"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL *</label>
              <input value={form.url || ''} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="/ atau #about"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Urutan Tampil</label>
              <input type="number" value={form.display_order ?? 0} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
            <span className="text-sm text-gray-300">Published (Tampil di website)</span>
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm">Batal</button>
          </div>
        </div>
      )}

      {navs.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl"><p className="text-gray-500">Belum ada menu navigasi.</p></div>
      ) : (
        <div className="space-y-3">
          {navs.map((nav) => (
            <div key={nav.id} className={`glass rounded-xl p-4 flex items-center gap-4 ${!nav.published ? 'opacity-60' : ''}`}>
              <GripVertical size={16} className="text-gray-600 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{nav.label}</span>
                  {!nav.published && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">Draft</span>}
                </div>
                <p className="text-gray-500 text-sm font-mono">{nav.url}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => togglePublish(nav)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                  {nav.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => openEdit(nav)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400 transition-colors"><Pencil size={16} /></button>
                <button onClick={() => setDeleteId(nav.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmDialog open={!!deleteId} description="Hapus menu ini?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
