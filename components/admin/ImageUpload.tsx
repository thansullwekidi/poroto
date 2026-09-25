'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  bucket: string
  folder?: string
  label?: string
  aspectRatio?: 'square' | 'video' | 'auto'
}

export default function ImageUpload({
  value,
  onChange,
  bucket,
  folder = 'uploads',
  label = 'Upload Gambar',
  aspectRatio = 'square',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      toast.error('Hanya file gambar yang diizinkan.')
      return
    }

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB.')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      onChange(data.publicUrl)
      toast.success('Gambar berhasil diupload!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Gagal mengupload gambar. Silakan coba lagi.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'min-h-[120px]',
  }[aspectRatio]

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}

      {value ? (
        <div className="relative group">
          <div className={`relative ${aspectClass} rounded-xl overflow-hidden bg-gray-800 border border-gray-700`}>
            <Image src={value} alt="Preview" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-500 text-gray-950 rounded-lg text-sm font-medium hover:bg-cyan-400 transition-colors"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/80 text-white rounded-lg text-sm font-medium hover:bg-red-500 transition-colors"
            >
              <X size={14} /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`w-full ${aspectClass} rounded-xl border-2 border-dashed border-gray-700 hover:border-cyan-500/50 transition-colors flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-cyan-400 bg-gray-800/50`}
        >
          {uploading ? (
            <>
              <Loader2 size={32} className="animate-spin text-cyan-400" />
              <span className="text-sm">Mengupload...</span>
            </>
          ) : (
            <>
              <Upload size={32} />
              <div className="text-center">
                <p className="text-sm font-medium">Klik untuk upload</p>
                <p className="text-xs text-gray-600 mt-1">PNG, JPG, WebP — Maks. 5MB</p>
              </div>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}
