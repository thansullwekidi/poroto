'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'
import type { Hero } from '@/types'

function Field({ label, value, onChange, placeholder, type = 'text', hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
    </div>
  )
}

export default function AdminHeroPage() {
  const [hero, setHero] = useState<Partial<Hero>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('hero').select('*').single()
      if (data) setHero(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { id, ...rest } = hero as Hero
      if (id) {
        await supabase.from('hero').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id)
      } else {
        await supabase.from('hero').insert({ ...rest })
      }
      toast.success('Hero section berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Section</h1>
          <p className="text-gray-400 text-sm mt-1">Kelola tampilan hero di halaman utama</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {/* Preview card */}
      <div className="glass rounded-xl p-4 border border-cyan-500/20">
        <p className="text-xs text-cyan-400 font-medium mb-2">Preview Teks</p>
        <p className="text-gray-400 text-sm">{hero.greeting || '—'} <span className="text-white font-semibold">{hero.name || '—'}</span></p>
        <p className="text-cyan-400 text-sm">{hero.headline || '—'}</p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Greeting" value={hero.greeting || ''} onChange={(v) => setHero({ ...hero, greeting: v })} placeholder="Halo, Saya" hint={`Contoh: "Halo, Saya" atau "Hi, I'm"`} />
          <Field label="Nama" value={hero.name || ''} onChange={(v) => setHero({ ...hero, name: v })} placeholder="Nama lengkap Anda" />
        </div>
        <Field label="Headline / Jabatan" value={hero.headline || ''} onChange={(v) => setHero({ ...hero, headline: v })} placeholder="Graphic Designer & Informatics Student" />
        <Field label="Subtitle" value={hero.subtitle || ''} onChange={(v) => setHero({ ...hero, subtitle: v })} placeholder="Mahasiswa Informatika · UIN Sultan Maulana Hasanuddin" />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
          <textarea rows={4} value={hero.description || ''} onChange={(e) => setHero({ ...hero, description: e.target.value })}
            placeholder="Deskripsi singkat tentang diri Anda..."
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
        </div>

        <ImageUpload value={hero.profile_image_url || null} onChange={(url) => setHero({ ...hero, profile_image_url: url || undefined })}
          bucket="profile-images" folder="hero" label="Foto Profil Hero" aspectRatio="square" />

        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm font-medium text-gray-300 mb-4">Tombol CTA</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Teks Tombol Utama" value={hero.primary_button_text || ''} onChange={(v) => setHero({ ...hero, primary_button_text: v })} placeholder="Lihat Portfolio" />
            <Field label="URL Tombol Utama" value={hero.primary_button_url || ''} onChange={(v) => setHero({ ...hero, primary_button_url: v })} placeholder="#projects" />
            <Field label="Teks Tombol Kedua" value={hero.secondary_button_text || ''} onChange={(v) => setHero({ ...hero, secondary_button_text: v })} placeholder="Hubungi Saya" />
            <Field label="URL Tombol Kedua" value={hero.secondary_button_url || ''} onChange={(v) => setHero({ ...hero, secondary_button_url: v })} placeholder="#contact" />
          </div>
        </div>
      </div>
    </div>
  )
}
