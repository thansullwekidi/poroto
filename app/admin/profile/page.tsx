'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'
import type { Profile } from '@/types'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('profile').select('*').single()
      if (data) setProfile(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { id, ...rest } = profile as Profile
      if (id) {
        await supabase.from('profile').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id)
      } else {
        await supabase.from('profile').insert({ ...rest })
      }
      toast.success('Profile berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Kelola informasi profil Anda</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <ImageUpload
          value={profile.photo_url || null}
          onChange={(url) => setProfile({ ...profile, photo_url: url || undefined })}
          bucket="profile-images"
          folder="photos"
          label="Foto Profil"
          aspectRatio="square"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nama Lengkap *" value={profile.name || ''} onChange={(v) => setProfile({ ...profile, name: v })} placeholder="Muhammad Sulthan Fajri Rabbani" />
          <Field label="Nama Panggilan" value={profile.nickname || ''} onChange={(v) => setProfile({ ...profile, nickname: v })} placeholder="Sulthan Fajri" />
        </div>

        <Field label="Bio Singkat" value={profile.bio || ''} onChange={(v) => setProfile({ ...profile, bio: v })} placeholder="Mahasiswa Informatika & Graphic Designer" />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">About Description</label>
          <textarea
            rows={6}
            value={profile.about_description || ''}
            onChange={(e) => setProfile({ ...profile, about_description: e.target.value })}
            placeholder="Ceritakan tentang diri Anda..."
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Lokasi" value={profile.location || ''} onChange={(v) => setProfile({ ...profile, location: v })} placeholder="Banten, Indonesia" />
          <Field label="Email" value={profile.email || ''} onChange={(v) => setProfile({ ...profile, email: v })} placeholder="email@example.com" type="email" />
        </div>

        <Field label="WhatsApp" value={profile.whatsapp || ''} onChange={(v) => setProfile({ ...profile, whatsapp: v })} placeholder="+62812..." />

        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm font-medium text-gray-300 mb-4">Social Media</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="GitHub URL" value={profile.social_github || ''} onChange={(v) => setProfile({ ...profile, social_github: v })} placeholder="https://github.com/username" />
            <Field label="Instagram URL" value={profile.social_instagram || ''} onChange={(v) => setProfile({ ...profile, social_instagram: v })} placeholder="https://instagram.com/username" />
            <Field label="LinkedIn URL" value={profile.social_linkedin || ''} onChange={(v) => setProfile({ ...profile, social_linkedin: v })} placeholder="https://linkedin.com/in/username" />
            <Field label="Behance URL" value={profile.social_behance || ''} onChange={(v) => setProfile({ ...profile, social_behance: v })} placeholder="https://behance.net/username" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
      />
    </div>
  )
}
