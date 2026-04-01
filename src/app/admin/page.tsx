'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { Plus, Trash2, Save, LogOut, GripVertical, AlertCircle, CheckCircle } from 'lucide-react'
import { defaultContent, SiteContent, FaqItem, Hotel } from '@/lib/content'

const ADMIN_SESSION_KEY = 'admin_token'

// ── Inline editable field ────────────────────────────────────────────────────

function EditableField({
  value,
  onChange,
  multiline = false,
  className = '',
  placeholder = 'Click to edit…',
}: {
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  className?: string
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null)

  useEffect(() => {
    if (editing) ref.current?.focus()
  }, [editing])

  const base =
    'w-full bg-transparent outline-none border-b-2 border-amber-400 transition-colors font-inherit text-inherit leading-inherit'

  if (editing) {
    return multiline ? (
      <textarea
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        rows={4}
        className={`${base} resize-none ${className}`}
        placeholder={placeholder}
      />
    ) : (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        className={`${base} ${className}`}
        placeholder={placeholder}
      />
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      title="Click to edit"
      className={`cursor-text rounded px-1 -mx-1 hover:bg-amber-50 hover:outline hover:outline-1 hover:outline-amber-300 transition-all whitespace-pre-wrap ${className} ${
        !value ? 'text-stone-400 italic' : ''
      }`}
    >
      {value || placeholder}
    </div>
  )
}

// ── Admin page ───────────────────────────────────────────────────────────────

type Toast = { type: 'success' | 'error'; message: string } | null

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [loginInput, setLoginInput] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<Toast>(null)

  // Restore session
  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_SESSION_KEY)
    if (saved) setToken(saved)
  }, [])

  // Load content once logged in
  useEffect(() => {
    if (!token) return
    fetch('/api/content')
      .then((r) => r.json())
      .then((data: SiteContent) => setContent(data))
      .catch(() => {})
  }, [token])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: loginInput }),
    })
    const { valid } = await res.json()
    if (valid) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, loginInput)
      setToken(loginInput)
    } else {
      setLoginError(true)
      setLoginInput('')
    }
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setToken(null)
  }

  function update(patch: Partial<SiteContent>) {
    setContent((c) => ({ ...c, ...patch }))
    setDirty(true)
  }

  function updateFaq(index: number, patch: Partial<FaqItem>) {
    const faq = content.faq.map((item, i) => (i === index ? { ...item, ...patch } : item))
    update({ faq })
  }

  function addFaq() {
    update({ faq: [...content.faq, { question: '', answer: '' }] })
  }

  function removeFaq(index: number) {
    update({ faq: content.faq.filter((_, i) => i !== index) })
  }

  function updateHotel(index: number, patch: Partial<Hotel>) {
    const hotels = content.hotels.map((h, i) => (i === index ? { ...h, ...patch } : h))
    update({ hotels })
  }

  async function save() {
    if (!token) return
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(content),
      })
      if (res.ok) {
        setDirty(false)
        setToast({ type: 'success', message: 'Changes saved! Guests will see the updates immediately.' })
      } else {
        const { error } = await res.json()
        setToast({ type: 'error', message: error ?? 'Failed to save.' })
      }
    } catch {
      setToast({ type: 'error', message: 'Network error. Please try again.' })
    }
    setSaving(false)
  }

  // ── Login screen ─────────────────────────────────────────────────────────

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="flex flex-col items-center gap-6 border rounded-lg bg-white px-12 py-14 shadow-sm" style={{ borderColor: '#e8d5c4' }}>
          <p className="font-serif text-2xl tracking-wide" style={{ color: '#722F37' }}>Admin Access</p>
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 w-64">
            <input
              type="password"
              value={loginInput}
              onChange={(e) => { setLoginInput(e.target.value); setLoginError(false) }}
              placeholder="Admin password"
              autoFocus
              className="w-full border-b-2 bg-transparent py-2 text-center font-serif outline-none transition-colors"
              style={{ borderColor: loginError ? '#f87171' : '#722F37', color: '#722F37' }}
            />
            {loginError && (
              <p className="font-serif text-xs text-red-400">Incorrect password.</p>
            )}
            <button
              type="submit"
              className="w-full border py-2 font-serif text-sm tracking-widest uppercase transition-colors hover:bg-stone-50"
              style={{ borderColor: '#722F37', color: '#722F37' }}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg px-6 py-3 shadow-lg font-serif text-sm text-white transition-all ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm" style={{ borderColor: '#e8d5c4' }}>
        <div>
          <p className="font-serif text-xl tracking-wide" style={{ color: '#722F37' }}>Site Editor</p>
          <p className="font-serif text-xs tracking-widest uppercase" style={{ color: '#C5A258' }}>
            Click any text to edit · Changes go live when you save
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="font-serif text-xs text-amber-600 tracking-wide">Unsaved changes</span>
          )}
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="flex items-center gap-2 px-5 py-2 font-serif text-sm tracking-widest uppercase border transition-colors disabled:opacity-40"
            style={{ borderColor: '#722F37', color: '#722F37' }}
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 font-serif text-sm border border-stone-300 text-stone-500 hover:bg-stone-50 transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-14">

        {/* ── Home welcome ── */}
        <section>
          <h2 className="font-serif text-xs tracking-[0.2em] uppercase mb-6 pb-2 border-b" style={{ color: '#C5A258', borderColor: '#e8d5c4' }}>
            Home Page — Welcome Section
          </h2>
          <div className="bg-white rounded-lg border p-8 space-y-4" style={{ borderColor: '#e8d5c4' }}>
            <div>
              <p className="font-serif text-xs text-stone-400 mb-1 tracking-wide">Title</p>
              <EditableField
                value={content.home_welcome_title}
                onChange={(v) => update({ home_welcome_title: v })}
                className="font-serif text-3xl"
              />
            </div>
            <div>
              <p className="font-serif text-xs text-stone-400 mb-1 tracking-wide">Body text</p>
              <EditableField
                value={content.home_welcome_body}
                onChange={(v) => update({ home_welcome_body: v })}
                multiline
                className="font-serif text-base leading-relaxed"
              />
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <div className="flex items-center justify-between mb-6 pb-2 border-b" style={{ borderColor: '#e8d5c4' }}>
            <h2 className="font-serif text-xs tracking-[0.2em] uppercase" style={{ color: '#C5A258' }}>
              FAQ — {content.faq.length} questions
            </h2>
            <button
              onClick={addFaq}
              className="flex items-center gap-1.5 font-serif text-xs tracking-widest uppercase border px-4 py-2 transition-colors hover:bg-stone-50"
              style={{ borderColor: '#722F37', color: '#722F37' }}
            >
              <Plus size={12} /> Add question
            </button>
          </div>

          <div className="space-y-4">
            {content.faq.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border p-6 grid grid-cols-[1fr_1px_1fr] gap-0"
                style={{ borderColor: '#e8d5c4' }}
              >
                {/* Question */}
                <div className="pr-6 space-y-2">
                  <p className="font-serif text-xs text-stone-400 tracking-wide">Question</p>
                  <EditableField
                    value={item.question}
                    onChange={(v) => updateFaq(i, { question: v })}
                    className="font-serif text-base tracking-wide uppercase leading-snug"
                    placeholder="Enter question…"
                  />
                </div>

                {/* Divider */}
                <div className="w-px self-stretch mx-0" style={{ backgroundColor: '#e8d5c4' }} />

                {/* Answer */}
                <div className="pl-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-xs text-stone-400 tracking-wide">Answer</p>
                    <button
                      onClick={() => removeFaq(i)}
                      className="text-stone-300 hover:text-red-400 transition-colors"
                      title="Remove question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <EditableField
                    value={item.answer}
                    onChange={(v) => updateFaq(i, { answer: v })}
                    multiline
                    className="font-serif text-base leading-relaxed"
                    placeholder="Enter answer…"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Hotels ── */}
        <section>
          <h2 className="font-serif text-xs tracking-[0.2em] uppercase mb-6 pb-2 border-b" style={{ color: '#C5A258', borderColor: '#e8d5c4' }}>
            Travel — Hotel Listings
          </h2>
          <div className="space-y-4">
            {content.hotels.map((hotel, i) => (
              <div key={i} className="bg-white rounded-lg border p-6 space-y-3" style={{ borderColor: '#e8d5c4' }}>
                <p className="font-serif text-xs text-stone-400 tracking-wide">{hotel.type} · {hotel.name}</p>
                <EditableField
                  value={hotel.description}
                  onChange={(v) => updateHotel(i, { description: v })}
                  multiline
                  className="font-serif text-base leading-relaxed"
                />
                <div className="flex gap-4 text-xs font-serif text-stone-400">
                  {hotel.email && (
                    <div>
                      <span className="tracking-wide">Email: </span>
                      <EditableField
                        value={hotel.email}
                        onChange={(v) => updateHotel(i, { email: v })}
                        className="inline text-stone-500"
                      />
                    </div>
                  )}
                  <div>
                    <span className="tracking-wide">Link: </span>
                    <EditableField
                      value={hotel.href}
                      onChange={(v) => updateHotel(i, { href: v })}
                      className="inline text-stone-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
