import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  // Import server supabase lazily to avoid build errors when env not set
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .single()

    if (settings) {
      return {
        title: {
          default: settings.seo_title || settings.website_title,
          template: `%s | ${settings.website_name}`,
        },
        description: settings.seo_description,
        keywords: settings.seo_keywords?.split(',').map((k: string) => k.trim()),
        openGraph: {
          title: settings.seo_title || settings.website_title,
          description: settings.seo_description,
          images: settings.og_image_url ? [settings.og_image_url] : [],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: settings.seo_title || settings.website_title,
          description: settings.seo_description,
          images: settings.og_image_url ? [settings.og_image_url] : [],
        },
        icons: {
          icon: settings.favicon_url || '/favicon.ico',
        },
      }
    }
  } catch {
    // Fallback metadata jika database belum terhubung
  }

  return {
    title: {
      default: 'Portfolio Website',
      template: '%s | Portfolio',
    },
    description: 'Portfolio CMS built with Next.js and Supabase.',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased bg-gray-950 text-gray-100">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#06b6d4',
                secondary: '#f9fafb',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
