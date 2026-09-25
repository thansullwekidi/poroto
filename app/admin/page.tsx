import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  FolderOpen,
  Eye,
  FileText,
  Star,
  MessageSquare,
  MessageCircleOff,
  Plus,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()

  const [
    projectsRes,
    skillsRes,
    servicesRes,
    experiencesRes,
    educationRes,
    messagesRes,
  ] = await Promise.all([
    supabase.from('projects').select('id, published'),
    supabase.from('skills').select('id'),
    supabase.from('services').select('id'),
    supabase.from('experiences').select('id'),
    supabase.from('education').select('id'),
    supabase.from('messages').select('id, read'),
  ])

  const projects = projectsRes.data || []
  const messages = messagesRes.data || []

  return {
    totalProjects: projects.length,
    publishedProjects: projects.filter((p) => p.published).length,
    draftProjects: projects.filter((p) => !p.published).length,
    totalSkills: skillsRes.data?.length || 0,
    totalServices: servicesRes.data?.length || 0,
    totalExperiences: experiencesRes.data?.length || 0,
    totalEducation: educationRes.data?.length || 0,
    totalMessages: messages.length,
    unreadMessages: messages.filter((m) => !m.read).length,
  }
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const stats = await getStats()

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Published',
      value: stats.publishedProjects,
      icon: Eye,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Draft',
      value: stats.draftProjects,
      icon: FileText,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Total Skills',
      value: stats.totalSkills,
      icon: Star,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Total Pesan',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Belum Dibaca',
      value: stats.unreadMessages,
      icon: MessageCircleOff,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ]

  const quickActions = [
    { label: 'Tambah Project', href: '/admin/projects/new', icon: FolderOpen },
    { label: 'Tambah Skill', href: '/admin/skills', icon: Star },
    { label: 'Tambah Experience', href: '/admin/experience', icon: Award },
    { label: 'Tambah Education', href: '/admin/education', icon: GraduationCap },
    { label: 'Tambah Service', href: '/admin/services', icon: Briefcase },
    { label: 'Lihat Pesan', href: '/admin/messages', icon: MessageSquare },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Selamat datang kembali! Kelola seluruh konten website Anda di sini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="glass rounded-xl p-5 flex flex-col items-center text-center"
          >
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={20} className={card.color} />
            </div>
            <div className={`text-2xl font-bold ${card.color} mb-1`}>{card.value}</div>
            <div className="text-gray-400 text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="glass rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-cyan-500/40 hover:text-cyan-400 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-800 group-hover:bg-cyan-500/10 flex items-center justify-center transition-colors">
                <action.icon size={18} className="text-gray-400 group-hover:text-cyan-400" />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-cyan-400">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info panel */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Panduan Cepat</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <p className="font-medium text-gray-200 mb-1">Cara mengelola konten:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Pilih menu di sidebar kiri</li>
              <li>Edit, tambah, atau hapus konten</li>
              <li>Klik &quot;Simpan&quot; untuk menyimpan perubahan</li>
              <li>Klik &quot;Publish&quot; agar tampil di website</li>
            </ol>
          </div>
          <div>
            <p className="font-medium text-gray-200 mb-1">Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Status &quot;Draft&quot; tidak tampil di website publik</li>
              <li>Status &quot;Published&quot; tampil di website publik</li>
              <li>Gunakan &quot;Featured&quot; untuk menampilkan di bagian utama</li>
              <li>Klik &quot;Lihat Website&quot; di header untuk preview</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
