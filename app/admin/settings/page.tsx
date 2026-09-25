'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Globe, Palette, Share2, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'
import type { Settings } from '@/types'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<Settings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'seo' | 'contact'>('general')

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('settings').select('*').single()
      if (data) setSettings(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { id, ...rest } = settings as Settings
      if (id) {
        await supabase.from('settings').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id)
      } else {
        await supabase.from('settings').insert({ ...rest })
      }
      toast.success('Pengaturan berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan pengaturan.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  const tabs = [
    { id: 'general', label: 'Umum', icon: Globe },
    { id: 'appearance', label: 'Tampilan', icon: Palette },
    { id: 'seo', label: 'SEO & Meta', icon: Share2 },
    { id: 'contact', label: 'Kontak & Sosial', icon: Phone },
  ] as const

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Konfigurasi global website Anda</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content area */}
        <div className="flex-1 glass rounded-2xl p-6 min-h-[500px]">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-4">Pengaturan Umum</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Website</label>
                <input type="text" value={settings.website_name || ''} onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
                  placeholder="Misal: Sulthan Portfolio" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title Default (Title Tag)</label>
                <input type="text" value={settings.website_title || ''} onChange={(e) => setSettings({ ...settings, website_title: e.target.value })}
                  placeholder="Muhammad Sulthan Fajri Rabbani | Graphic Designer" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">Tampilan & Branding</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logo Website</label>
                  <ImageUpload value={settings.logo_url || null} onChange={(url) => setSettings({ ...settings, logo_url: url || undefined })} bucket="general" folder="brand" label="" aspectRatio="square" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Favicon (Ikon Tab Browser)</label>
                  <ImageUpload value={settings.favicon_url || null} onChange={(url) => setSettings({ ...settings, favicon_url: url || undefined })} bucket="general" folder="brand" label="" aspectRatio="square" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Warna Utama (Hex)</label>
                  <input type="text" value={settings.primary_color || ''} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    placeholder="#06b6d4" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Warna Sekunder (Hex)</label>
                  <input type="text" value={settings.secondary_color || ''} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    placeholder="#0891b2" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-4">
                <input type="checkbox" checked={settings.dark_mode ?? true} onChange={(e) => setSettings({ ...settings, dark_mode: e.target.checked })} className="rounded border-gray-600 bg-gray-800 text-cyan-500" />
                <span className="text-sm text-gray-300">Aktifkan Dark Mode (Default)</span>
              </label>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-4">Search Engine Optimization (SEO)</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SEO Title</label>
                <input type="text" value={settings.seo_title || ''} onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                  placeholder="Judul untuk mesin pencari..." className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SEO Description</label>
                <textarea rows={3} value={settings.seo_description || ''} onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                  placeholder="Deskripsi untuk hasil pencarian Google..." className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SEO Keywords (Pisahkan dengan koma)</label>
                <input type="text" value={settings.seo_keywords || ''} onChange={(e) => setSettings({ ...settings, seo_keywords: e.target.value })}
                  placeholder="portfolio, desain grafis, informatika, nextjs..." className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">OpenGraph / Share Image</label>
                <ImageUpload value={settings.og_image_url || null} onChange={(url) => setSettings({ ...settings, og_image_url: url || undefined })} bucket="general" folder="brand" label="Gambar saat link di-share" aspectRatio="video" />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-4">Kontak Utama & Sosial</h2>
              <p className="text-xs text-gray-400 mb-4 bg-gray-800/50 p-3 rounded-lg">Ini adalah informasi kontak yang ditampilkan secara global (seperti di footer atau halaman kontak). Untuk URL sosial yang spesifik, kelola di halaman Profile.</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Utama</label>
                  <input type="email" value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="email@example.com" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nomor WhatsApp</label>
                  <input type="text" value={settings.whatsapp || ''} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    placeholder="+628123456789" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800">
                {['github', 'instagram', 'linkedin', 'twitter', 'youtube', 'behance'].map((platform) => {
                  const key = `social_${platform}` as keyof Settings;
                  return (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">{platform} URL</label>
                      <input type="url" value={(settings[key] as string) || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                        placeholder={`https://${platform}.com/...`} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
