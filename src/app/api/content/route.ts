import { NextResponse } from 'next/server'
import { defaultContent, SiteContent } from '@/lib/content'

const KV_KEY = 'site_content_v1'

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  const { kv } = await import('@vercel/kv')
  return kv
}

export async function GET() {
  try {
    const kv = await getKv()
    if (kv) {
      const stored = await kv.get<Partial<SiteContent>>(KV_KEY)
      if (stored) {
        return NextResponse.json({
          ...defaultContent,
          ...stored,
          faq: stored.faq ?? defaultContent.faq,
          hotels: stored.hotels ?? defaultContent.hotels,
        })
      }
    }
  } catch {
    // Fall through to defaults
  }
  return NextResponse.json(defaultContent)
}

export async function PUT(request: Request) {
  const token = request.headers.get('x-admin-token')
  if (!process.env.ADMIN_PASSWORD || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const kv = await getKv()
  if (!kv) {
    return NextResponse.json(
      { error: 'KV storage not configured. Set up Vercel KV in your dashboard.' },
      { status: 503 }
    )
  }

  try {
    const body = (await request.json()) as SiteContent
    await kv.set(KV_KEY, body)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
