import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Batas waktu 4 detik untuk setiap request ke Supabase — mencegah 504 Gateway Timeout
function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    promise,
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
    const { data } = await withTimeout(supabase.auth.getUser())
    user = data.user
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
      const { data: adminUser } = await withTimeout(
        supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .single()
      )

      if (!adminUser) {
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
      const { data: adminUser } = await withTimeout(
        supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .single()
      )

      if (adminUser) {
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
