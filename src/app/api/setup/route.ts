import { Pool } from 'pg'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL
  if (!url) {
    return NextResponse.json({ error: 'POSTGRES_URL not set in environment' }, { status: 503 })
  }

  const cleanUrl = url
    .replace(/[?&]sslmode=[^&]*/g, (m) => m.startsWith('?') ? '?' : '')
    .replace(/[?&]pgbouncer=[^&]*/g, (m) => m.startsWith('?') ? '?' : '')
    .replace(/[?&]supa=[^&]*/g, (m) => m.startsWith('?') ? '?' : '')
    .replace(/\?$/, '')
  const pool = new Pool({ connectionString: cleanUrl, ssl: { rejectUnauthorized: false } })

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rsvp_responses (
        id SERIAL PRIMARY KEY,
        party_id VARCHAR(100) NOT NULL,
        member_id VARCHAR(100) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        attending_welcome_party BOOLEAN,
        attending_ceremony BOOLEAN,
        attending_reception BOOLEAN,
        attending_farewell_brunch BOOLEAN,
        dietary_restrictions TEXT,
        submitted_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(party_id, member_id)
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS guest_name_updates (
        id SERIAL PRIMARY KEY,
        party_id VARCHAR(100) NOT NULL,
        member_id VARCHAR(100) NOT NULL,
        new_first_name VARCHAR(100) NOT NULL,
        new_last_name VARCHAR(100),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(party_id, member_id)
      )
    `)

    return NextResponse.json({ success: true, message: 'Tables created successfully.' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tables', detail: String(error) },
      { status: 500 }
    )
  } finally {
    await pool.end()
  }
}
