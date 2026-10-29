import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Batas waktu 4 detik — mencegah 504 Gateway Timeout
// Menerima PromiseLike agar kompatibel dengan Supabase PostgrestBuilder
function withTimeout<T>(thenable: PromiseLike<T>, ms = 4000): Promise<T> {
  return Promise.race([
    Promise.resolve(thenable),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ])
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: jangan tulis kode antara createServerClient dan
  // auth.getUser() untuk menghindari masalah logout pengguna

  let user = null
  try {
    const authResult = await withTimeout(supabase.auth.getUser())
    user = authResult.data.user
  } catch {
    // Jika Supabase timeout/error, jangan block request — lewatkan saja
    return supabaseResponse
  }

  const { pathname } = request.nextUrl

  // Proteksi semua route /admin/* kecuali /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      // Tidak ada session → redirect ke login
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Cek apakah user adalah admin
    try {
      const adminResult = await withTimeout(
        Promise.resolve(
          supabase
            .from('admin_users')
            .select('id')
            .eq('user_id', user.id)
            .single()
        )
      )

      if (!adminResult.data) {
        // User ada tapi bukan admin → access denied
        const deniedUrl = request.nextUrl.clone()
        deniedUrl.pathname = '/admin/login'
        deniedUrl.searchParams.set('error', 'access_denied')
        return NextResponse.redirect(deniedUrl)
      }
    } catch {
      // Jika query DB timeout, arahkan ke login daripada 504
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.searchParams.set('error', 'timeout')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Jika sudah login dan mencoba akses /admin/login → redirect ke dashboard
  if (pathname === '/admin/login' && user) {
    try {
      const adminResult = await withTimeout(
        Promise.resolve(
          supabase
            .from('admin_users')
            .select('id')
            .eq('user_id', user.id)
            .single()
        )
      )

      if (adminResult.data) {
        const dashboardUrl = request.nextUrl.clone()
        dashboardUrl.pathname = '/admin'
        return NextResponse.redirect(dashboardUrl)
      }
    } catch {
      // Jika timeout, biarkan tetap di halaman login
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match semua path kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
