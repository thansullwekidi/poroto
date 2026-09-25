'use client'

import { useState, useEffect } from 'react'
import { Mail, Trash2, Loader2, CheckCircle, Circle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import toast from 'react-hot-toast'
import type { Message } from '@/types'
import { formatDate } from '@/lib/utils'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const fetchMessages = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const markRead = async (id: string, read: boolean) => {
    const supabase = createClient()
    await supabase.from('messages').update({ read }).eq('id', id)
    setMessages(messages.map((m) => m.id === id ? { ...m, read } : m))
  }

  const handleSelect = (msg: Message) => {
    setSelectedId(selectedId === msg.id ? null : msg.id)
    if (!msg.read) markRead(msg.id, true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('messages').delete().eq('id', deleteId)
      toast.success('Pesan dihapus!')
      if (selectedId === deleteId) setSelectedId(null)
      setDeleteId(null)
      fetchMessages()
    } catch { toast.error('Gagal menghapus.') }
    finally { setDeleting(false) }
  }

  const filtered = messages.filter((m) => filter === 'all' ? true : filter === 'unread' ? !m.read : m.read)
  const unreadCount = messages.filter((m) => !m.read).length
  const selected = selectedId ? messages.find((m) => m.id === selectedId) : null

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pesan Masuk</h1>
          <p className="text-gray-400 text-sm mt-1">{messages.length} pesan · {unreadCount} belum dibaca</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === f ? 'bg-cyan-500 text-gray-950 font-medium' : 'glass text-gray-400 hover:text-white'}`}>
              {f === 'all' ? 'Semua' : f === 'unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <Mail size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500">Tidak ada pesan.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Message list */}
          <div className="lg:col-span-2 space-y-2">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedId === msg.id ? 'border border-cyan-500/40 bg-cyan-500/5' : 'hover:border-gray-600'} ${!msg.read ? 'border-l-2 border-l-cyan-400' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {!msg.read ? <Circle size={8} className="text-cyan-400 fill-cyan-400 shrink-0 mt-1" /> : <Circle size={8} className="text-gray-600 shrink-0 mt-1" />}
                    <span className={`text-sm font-medium ${!msg.read ? 'text-white' : 'text-gray-300'}`}>{msg.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                </div>
                {msg.subject && <p className="text-xs text-gray-400 ml-4 mb-1 font-medium">{msg.subject}</p>}
                <p className="text-xs text-gray-500 ml-4 line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Message detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="glass rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-cyan-400 text-sm hover:underline">{selected.email}</a>
                    <p className="text-gray-500 text-xs mt-1">{formatDate(selected.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => markRead(selected.id, !selected.read)} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" title={selected.read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}>
                      {selected.read ? <Circle size={16} /> : <CheckCircle size={16} className="text-cyan-400" />}
                    </button>
                    <button onClick={() => setDeleteId(selected.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                {selected.subject && (
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-sm text-gray-400 mb-1">Subjek:</p>
                    <p className="font-medium text-white">{selected.subject}</p>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-400 mb-2">Pesan:</p>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line">{selected.message}</p>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Pesan Anda'}`} className="btn-primary inline-flex text-sm">
                    <Mail size={14} /> Balas via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center text-gray-500">
                <Mail size={40} className="mx-auto mb-3 opacity-30" />
                <p>Pilih pesan untuk melihat isinya</p>
              </div>
            )}
          </div>
        </div>
      )}

      <DeleteConfirmDialog open={!!deleteId} description="Hapus pesan ini secara permanen?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
