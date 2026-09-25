'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Mail, MessageCircle, GitBranch as Github, Camera as Instagram, Briefcase as Linkedin, Download } from 'lucide-react'
import type { Profile } from '@/types'
import { formatWhatsAppLink } from '@/lib/utils'

interface AboutSectionProps {
  profile: Profile | null
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null

  const socialLinks = [
    { icon: Github, href: profile.social_github, label: 'GitHub' },
    { icon: Instagram, href: profile.social_instagram, label: 'Instagram' },
    { icon: Linkedin, href: profile.social_linkedin, label: 'LinkedIn' },
  ].filter((s) => s.href)

  return (
    <section id="about" className="section-padding bg-gray-900/30">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Image */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
              {profile.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-8xl font-bold text-cyan-500/30">
                    {profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
              )}
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-48 h-48 border border-cyan-500/20 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <div className="mb-2">
              <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Tentang Saya</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {profile.name}
            </h2>
            <p className="text-cyan-400 font-medium mb-6">{profile.bio}</p>
            <p className="text-gray-300 leading-relaxed mb-8 whitespace-pre-line">
              {profile.about_description}
            </p>

            {/* Info */}
            <div className="space-y-3 mb-8">
              {profile.location && (
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin size={16} className="text-cyan-400 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail size={16} className="text-cyan-400 shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:text-cyan-400 transition-colors">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.whatsapp && (
                <div className="flex items-center gap-3 text-gray-400">
                  <MessageCircle size={16} className="text-cyan-400 shrink-0" />
                  <a
                    href={formatWhatsAppLink(profile.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {profile.whatsapp}
                  </a>
                </div>
              )}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mb-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-200"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            )}

            {/* CV Download */}
            <CVDownloadButton />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CVDownloadButton() {
  return (
    <a href="/api/resume/download" className="btn-primary">
      <Download size={16} />
      Download CV
    </a>
  )
}
