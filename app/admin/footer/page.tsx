'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'
import type { Footer } from '@/types'

export default function AdminFooterPage() {
  const [footer, setFooter] = useState<Partial<Footer>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('footer').select('*').single()
      if (data) setFooter(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { id, ...rest } = footer as Footer
      if (id) {
        await supabase.from('footer').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id)
      } else {
        await supabase.from('footer').insert({ ...rest })
      }
      toast.success('Footer berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan footer.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Footer</h1>
          <p className="text-gray-400 text-sm mt-1">Kelola konten footer website Anda</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Logo Footer (Opsional)</label>
          <ImageUpload
            value={footer.logo_url || null}
            onChange={(url) => setFooter({ ...footer, logo_url: url || undefined })}
            bucket="logos"
            folder="footer"
            label=""
            aspectRatio="square"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Footer</label>
          <textarea
            rows={4}
            value={footer.description || ''}
            onChange={(e) => setFooter({ ...footer, description: e.target.value })}
            placeholder="Deskripsi singkat yang tampil di footer..."
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Copyright Text</label>
          <input
            type="text"
            value={footer.copyright || ''}
            onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
            placeholder="© 2026 M. Sulthan Fajri Rabbani. All rights reserved."
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={footer.show_social_links ?? true} 
              onChange={(e) => setFooter({ ...footer, show_social_links: e.target.checked })} 
              className="rounded border-gray-600 bg-gray-800 text-cyan-500" 
            />
            <span className="text-sm text-gray-300">Tampilkan Icon Social Media (Dari Profile)</span>
          </label>
        </div>
      </div>
    </div>
  )
}
