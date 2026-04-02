import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { upsertRsvpResponses, upsertNameUpdates } from '@/lib/db'
import type { RsvpSubmission, MemberResponse } from '@/types/rsvp'

const NOTIFY = ['eugenie.gruman@gmail.com', 'alexgoldberg0410@gmail.com']

const EVENT_LABELS: Record<string, string> = {
  attendingWelcomeParty:  'Welcome Party',
  attendingCeremony:      'Ceremony',
  attendingReception:     'Reception',
  attendingFarewellBrunch: 'Farewell Brunch',
}

function buildEmailHtml(responses: MemberResponse[]): string {
  const rows = responses.map((r) => {
    const name = `${r.firstName} ${r.lastName}`.trim()
    const events = Object.entries(EVENT_LABELS)
      .map(([key, label]) => {
        const attending = r[key as keyof MemberResponse]
        const symbol = attending === true ? '✅' : attending === false ? '❌' : '—'
        return `<tr><td style="padding:2px 12px 2px 0;color:#666">${label}</td><td>${symbol}</td></tr>`
      })
      .join('')
    const dietary = r.dietaryRestrictions
      ? `<p style="margin:6px 0 0;color:#555"><strong>Dietary:</strong> ${r.dietaryRestrictions}</p>`
      : ''
    return `
      <div style="margin-bottom:20px;padding:14px 16px;border:1px solid #e8d5c4;border-radius:6px;background:#fffdf9">
        <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#722F37">${name}</p>
        <table style="border-collapse:collapse;font-size:14px">${events}</table>
        ${dietary}
      </div>`
  }).join('')

  return `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#333">
      <h2 style="color:#722F37;margin-bottom:4px">New RSVP Received</h2>
      <p style="color:#888;margin-top:0;font-size:13px">eugenieandalex.com</p>
      ${rows}
    </div>`
}

export async function POST(request: Request) {
  let body: RsvpSubmission
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { partyId, responses, guestNameUpdates } = body

  if (!partyId || !Array.isArray(responses) || responses.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    await upsertRsvpResponses(partyId, responses)

    if (guestNameUpdates && guestNameUpdates.length > 0) {
      await upsertNameUpdates(partyId, guestNameUpdates)
    }

    // Send notification email — fire-and-forget so a mail failure never blocks the guest
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const names = responses.map((r) => `${r.firstName} ${r.lastName}`.trim()).join(' & ')
      resend.emails.send({
        from: 'rsvp@eugenieandalex.com',
        to: NOTIFY,
        subject: `RSVP: ${names}`,
        html: buildEmailHtml(responses),
      }).catch((err) => console.error('Email send failed:', err))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = String(error)
    if (msg.includes('not configured')) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Vercel Postgres.' },
        { status: 503 }
      )
    }
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 })
  }
}
