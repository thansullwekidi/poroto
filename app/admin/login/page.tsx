'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const error = searchParams.get('error')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error('Email atau password salah.')
        return
      }
      // Verify admin access
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Gagal autentikasi.'); return }
      const { data: adminUser } = await supabase.from('admin_users').select('id').eq('user_id', user.id).single()
      if (!adminUser) {
        await supabase.auth.signOut()
        toast.error('Anda tidak memiliki akses admin.')
        return
      }
      toast.success('Login berhasil!')
      const redirectTo = searchParams.get('redirectTo') || '/admin'
      router.push(redirectTo)
      router.refresh()
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Portfolio CMS — Area Pribadi</p>
      </div>

      {error === 'access_denied' && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          Anda tidak memiliki akses ke halaman ini.
        </div>
      )}

      <form onSubmit={handleLogin} className="glass rounded-2xl p-8 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="admin@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-50"
        >
          {loading ? 'Masuk...' : 'Masuk ke Dashboard'}
        </button>
      </form>

      <p className="text-center text-gray-600 text-xs mt-6">
        Tidak ada akun publik. Hanya administrator yang dapat mengakses area ini.
      </p>
    </div>
  )
}

import { Suspense } from 'react'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white text-center">Memuat form login...</div>}>
        <AdminLoginContent />
      </Suspense>
    </div>
  )
}
