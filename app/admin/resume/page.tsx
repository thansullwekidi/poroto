'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, Upload, FileText, Trash2, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import toast from 'react-hot-toast'
import type { Resume } from '@/types'
import { formatFileSize, formatDate } from '@/lib/utils'

export default function AdminResumePage() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchResume = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('resume').select('*').order('uploaded_at', { ascending: false }).limit(1).single()
    setResume(data || null)
    setLoading(false)
  }

  useEffect(() => { fetchResume() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Hanya file PDF yang diizinkan.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB.')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const fileName = `cv-${Date.now()}.pdf`
      
      const { error: uploadError } = await supabase.storage.from('resume').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('resume').getPublicUrl(fileName)
      
      await supabase.from('resume').insert({
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
      })

      toast.success('CV berhasil diupload!')
      fetchResume()
    } catch (error) {
      console.error(error)
      toast.error('Gagal mengupload CV.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    if (!resume) return
    setDeleting(true)
    try {
      const supabase = createClient()
      const fileName = resume.file_url.split('/').pop()
      if (fileName) {
        await supabase.storage.from('resume').remove([fileName])
      }
      await supabase.from('resume').delete().eq('id', resume.id)
      
      toast.success('CV berhasil dihapus!')
      setResume(null)
      setShowDelete(false)
    } catch (error) {
      toast.error('Gagal menghapus CV.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Resume / CV</h1>
          <p className="text-gray-400 text-sm mt-1">Kelola file Curriculum Vitae Anda</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        {resume ? (
          <div className="glass rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                <FileText size={24} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">{resume.file_name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                  <span>Ukuran: {formatFileSize(resume.file_size)}</span>
                  <span>Diunggah: {formatDate(resume.uploaded_at)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <a href={resume.file_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Download size={16} /> Lihat / Download
              </a>
              <button onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-secondary">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Ganti File
              </button>
              <button onClick={() => setShowDelete(true)} className="p-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 glass rounded-xl border border-dashed border-gray-700">
            <FileText size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Belum ada CV yang diunggah</h3>
            <p className="text-gray-400 text-sm mb-6">Upload file PDF CV terbaru Anda di sini.</p>
            <button onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-primary mx-auto inline-flex">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
              {uploading ? 'Mengupload...' : 'Upload CV PDF'}
            </button>
          </div>
        )}
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" onChange={handleUpload} className="hidden" />
      </div>

      <DeleteConfirmDialog 
        open={showDelete} 
        description="Apakah Anda yakin ingin menghapus CV ini? Link ke CV di website publik tidak akan berfungsi." 
        onConfirm={handleDelete} 
        onCancel={() => setShowDelete(false)} 
        loading={deleting} 
      />
    </div>
  )
}
