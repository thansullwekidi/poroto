'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, User, Zap, Info, Star, FolderOpen, Briefcase,
  GraduationCap, MessageSquare, FileText, Navigation, AlignJustify,
  Settings, ChevronLeft, ChevronRight, Award
} from 'lucide-react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile & About', icon: User },
  { href: '/admin/hero', label: 'Hero', icon: Zap },
  { href: '/admin/skills', label: 'Skills', icon: Star },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/experience', label: 'Experience', icon: Award },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/resume', label: 'Resume / CV', icon: FileText },
  { href: '/admin/navigation', label: 'Navigation', icon: Navigation },
  { href: '/admin/footer', label: 'Footer', icon: AlignJustify },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`relative flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-gray-800 ${
        collapsed ? 'justify-center px-2' : 'px-5'
      }`}>
        {!collapsed && (
          <span className="font-bold text-white text-sm">Portfolio CMS</span>
        )}
        {collapsed && <span className="text-cyan-400 font-bold text-lg">SF</span>}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-cyan-400 z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Menu items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
