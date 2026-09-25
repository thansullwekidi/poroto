'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Star, StarOff, Trash2, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import toast from 'react-hot-toast'

interface AdminProjectActionsProps {
  projectId: string
  published: boolean
  featured: boolean
  slug: string
}

export default function AdminProjectActions({ projectId, published, featured, slug }: AdminProjectActionsProps) {
  const router = useRouter()
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const togglePublish = async () => {
    const supabase = createClient()
    await supabase.from('projects').update({ published: !published }).eq('id', projectId)
    toast.success(published ? 'Project di-unpublish.' : 'Project berhasil dipublish!')
    router.refresh()
  }

  const toggleFeatured = async () => {
    const supabase = createClient()
    await supabase.from('projects').update({ featured: !featured }).eq('id', projectId)
    toast.success(featured ? 'Featured dihapus.' : 'Ditandai sebagai Featured!')
    router.refresh()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('projects').delete().eq('id', projectId)
      toast.success('Project berhasil dihapus!')
      setShowDelete(false)
      router.refresh()
    } catch {
      toast.error('Gagal menghapus project.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button onClick={toggleFeatured} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-yellow-400 transition-colors" title={featured ? 'Hapus Featured' : 'Jadikan Featured'}>
        {featured ? <Star size={16} className="fill-yellow-400 text-yellow-400" /> : <StarOff size={16} />}
      </button>
      <button onClick={togglePublish} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-green-400 transition-colors" title={published ? 'Unpublish' : 'Publish'}>
        {published ? <Eye size={16} className="text-green-400" /> : <EyeOff size={16} />}
      </button>
      <a href={`/projects/${slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400 transition-colors" title="Preview">
        <ExternalLink size={16} />
      </a>
      <button onClick={() => setShowDelete(true)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors" title="Hapus">
        <Trash2 size={16} />
      </button>

      <DeleteConfirmDialog
        open={showDelete}
        description="Apakah Anda yakin ingin menghapus project ini? Semua gambar galeri juga akan dihapus."
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </>
  )
}
