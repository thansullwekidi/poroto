'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, GitBranch as Github, Camera as Instagram, Briefcase as Linkedin, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Settings } from '@/types'
import { formatWhatsAppLink } from '@/lib/utils'

interface ContactSectionProps {
  settings: Settings | null
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Pesan berhasil dikirim! Saya akan segera menghubungi Anda.')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Failed')
      }
    } catch {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const socials = [
    { icon: Mail, href: settings?.email ? `mailto:${settings.email}` : null, label: settings?.email || 'Email' },
    { icon: MessageCircle, href: settings?.whatsapp ? formatWhatsAppLink(settings.whatsapp) : null, label: 'WhatsApp' },
    { icon: Github, href: settings?.social_github, label: 'GitHub' },
    { icon: Instagram, href: settings?.social_instagram, label: 'Instagram' },
    { icon: Linkedin, href: settings?.social_linkedin, label: 'LinkedIn' },
  ].filter((s) => s.href)

  return (
    <section id="contact" className="section-padding bg-gray-900/30">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Kontak</span>
          <h2 className="section-title mt-2">Hubungi Saya</h2>
          <p className="section-subtitle mx-auto">
            Punya project atau ingin berkolaborasi? Jangan ragu untuk menghubungi saya.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">Mari Terhubung</h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Saya selalu terbuka untuk peluang baru, kolaborasi kreatif, atau sekadar ngobrol tentang desain dan teknologi.
            </p>
            <div className="space-y-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-400 hover:text-cyan-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg glass flex items-center justify-center group-hover:border-cyan-500/40 transition-all">
                    <social.icon size={18} />
                  </div>
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nama *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="email@anda.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subjek</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Topik pesan Anda"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Pesan *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Ceritakan tentang proyek atau kolaborasi yang Anda inginkan..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <Send size={16} />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
