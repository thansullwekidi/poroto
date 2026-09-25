import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: resume, error } = await supabase
      .from('resume')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !resume) {
      return NextResponse.json({ error: 'CV tidak tersedia.' }, { status: 404 })
    }

    // Redirect ke file URL di Supabase Storage
    return NextResponse.redirect(resume.file_url)
  } catch (err) {
    console.error('Resume download error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
