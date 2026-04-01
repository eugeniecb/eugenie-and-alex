import { NextResponse } from 'next/server'
import { defaultContent, SiteContent } from '@/lib/content'

const REDIS_KEY = 'site_content_v1'

async function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  const { Redis } = await import('@upstash/redis')
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

export async function GET() {
  try {
    const redis = await getRedis()
    if (redis) {
      const stored = await redis.get<Partial<SiteContent>>(REDIS_KEY)
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

  const redis = await getRedis()
  if (!redis) {
    return NextResponse.json(
      { error: 'Redis not configured. Set up Upstash in your Vercel dashboard.' },
      { status: 503 }
    )
  }

  try {
    const body = (await request.json()) as SiteContent
    await redis.set(REDIS_KEY, body)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
