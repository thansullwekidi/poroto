'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, ExternalLink, ChevronDown, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AdminHeader() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Berhasil logout')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Admin Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <ExternalLink size={14} />
          Lihat Website
        </a>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-sm transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
              <User size={12} className="text-gray-950" />
            </div>
            <span className="hidden sm:block">Admin</span>
            <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-gray-800 border border-gray-700 shadow-xl z-50 py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-gray-700 transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
