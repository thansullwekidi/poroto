import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format tanggal ke Bahasa Indonesia
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format tahun saja
export function formatYear(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.getFullYear().toString()
}

// Format bulan dan tahun
export function formatMonthYear(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
  })
}

// Generate slug dari title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Format file size
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Format nomor WhatsApp untuk link
export function formatWhatsAppLink(number: string | null | undefined): string {
  if (!number) return ''
  const cleaned = number.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleaned}`
}

// Get initials dari nama
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Format periode waktu (pengalaman / pendidikan)
export function formatPeriod(
  start: string | number | null,
  end: string | number | null,
  current: boolean
): string {
  const startStr = start ? start.toString() : ''
  const endStr = current ? 'Sekarang' : end ? end.toString() : ''
  if (startStr && endStr) return `${startStr} – ${endStr}`
  if (startStr) return startStr
  return endStr
}
