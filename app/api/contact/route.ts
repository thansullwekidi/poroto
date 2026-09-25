import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Field wajib tidak boleh kosong.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('messages').insert({ name, email, subject, message })

    if (error) {
      console.error('Contact insert error:', error)
      return NextResponse.json({ error: 'Gagal menyimpan pesan.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}
