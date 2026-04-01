@AGENTS.md

# Wedding Website — Eugenie & Alex

A password-protected wedding website for Eugenie and Alex's Paris wedding.

- **Domain:** eugenieandalex.com
- **Wedding date:** September 6, 2026
- **Location:** Paris, France
- **Password gate:** `NEXT_PUBLIC_SITE_PASSWORD` in `.env.local` — every page is protected via `PasswordGate` in `layout.tsx`

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero with watercolor illustration, names, date |
| `/events` | Guest name lookup — shows only the events that guest is invited to (2 invitation tiers) |
| `/rsvp` | Embedded Zola RSVP widget |
| `/lodging` | Paris hotel recommendations and transport info |
| `/gallery` | Engagement and couple photos |
| `/registry` | Embedded Zola registry widget |
| `/faq` | Common guest questions |

### Event tiers
There are two guest tiers. The `/events` page lets a guest look up their name and see only the events they're invited to — do not show events from the other tier.

---

## Design

Inspired by the wedding invitations: watercolor botanicals, elegant and romantic.

**Color palette**
- Primary text: burgundy/wine (deep red-purple)
- Background: clean white
- Accents: soft sage green, warm blush, dusty rose

**Motifs:** pomegranates, lemons, flowers, watercolor botanical illustrations

**Typography**
- Headings / display: elegant serif (e.g. Playfair Display, Cormorant Garamond)
- Script accents: a handwritten/script font (e.g. Great Vibes, Dancing Script) for names and special labels
- Body: clean serif or refined sans-serif

**Aesthetic:** romantic, European, airy — not busy. Let white space breathe. Illustrations are the focal point; UI chrome should recede.

---

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
