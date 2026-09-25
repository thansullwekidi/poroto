'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GitBranch as Github, Camera as Instagram, Briefcase as Linkedin, MessageSquare as Twitter, Video as Youtube } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Footer, Navigation, Settings } from '@/types'

export default function Footer() {
  const [footer, setFooter] = useState<Footer | null>(null)
  const [navItems, setNavItems] = useState<Navigation[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const [footerRes, navRes, settingsRes] = await Promise.all([
        supabase.from('footer').select('*').single(),
        supabase.from('navigation').select('*').eq('published', true).order('display_order'),
        supabase.from('settings').select('*').single(),
      ])
      setFooter(footerRes.data)
      setNavItems(navRes.data || [])
      setSettings(settingsRes.data)
    }
    fetchData()
  }, [])

  const socials = [
    { icon: Github, href: settings?.social_github, label: 'GitHub' },
    { icon: Instagram, href: settings?.social_instagram, label: 'Instagram' },
    { icon: Linkedin, href: settings?.social_linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: settings?.social_twitter, label: 'Twitter' },
    { icon: Youtube, href: settings?.social_youtube, label: 'YouTube' },
  ].filter((s) => s.href)

  return (
    <footer className="border-t border-gray-800/50 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-white text-lg mb-3">
              {settings?.website_name || 'Sulthan Fajri'}
            </h3>
            {footer?.description && (
              <p className="text-gray-400 text-sm leading-relaxed">{footer.description}</p>
            )}
          </div>

          {/* Navigation */}
          {navItems.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-200 mb-4">Navigasi</h4>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social */}
          {socials.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-200 mb-4">Ikuti Saya</h4>
              <div className="flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800/50 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            {footer?.copyright || `© ${new Date().getFullYear()} Muhammad Sulthan Fajri Rabbani. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
