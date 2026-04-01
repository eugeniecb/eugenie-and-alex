import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const token = request.headers.get('x-admin-token')
  if (!process.env.ADMIN_PASSWORD || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    url_preview: (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)?.slice(0, 40) ?? null,
  })
}
