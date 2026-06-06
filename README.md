# Socle Lead Engine

AI-powered B2B lead generation platform for the luxury hospitality vertical. Scrapes hotel websites, scores prospects 1–100 using Claude AI, and generates personalized cold outreach — built to support Socle's go-to-market.

## What it does

The platform automates the top-of-funnel sales workflow:

1. **Search** — find luxury/boutique hotels by city, state, and type
2. **Analyze** — Claude AI reads each hotel's website and evaluates market fit: luxury level, staff intensity, tipping platform compatibility, key decision-makers
3. **Score** — every lead gets a 1–100 score with reasoning, based on 6 weighted signals
4. **Outreach** — auto-generates a cold email, call opener, and LinkedIn message for each lead
5. **Manage** — track status, add notes, and view pipeline analytics on a dashboard

## Stack

| | |
|---|---|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude API (`claude-3-haiku`) |
| Scraping | Cheerio + Axios |
| Deploy | Vercel |

## Architecture

```
app/
├── (dashboard)/          # Main app routes (leads list, detail, analytics)
├── api/
│   ├── leads/            # CRUD endpoints
│   └── scrapers/         # hotel-search: scrape + analyze + score
components/               # UI components
lib/
├── analysis/             # Claude prompts, scoring logic
├── scrapers/             # Hotel search, site fetching
└── supabase/             # DB client and query helpers
```

The scoring model weights 6 signals: luxury tier, staff intensity, tipping platform fit, tipped departments, hiring signals, and operational complexity. Scores and reasoning are stored per-lead in Supabase; website HTML is cached for 30 days.

## Running locally

```bash
git clone https://github.com/nadellasripad11/socle-lead-engine
cd socle-lead-engine
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY
npm run dev
```

Database schema: `docs/schema.sql`. Run it in your Supabase SQL editor before first use.

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leads` | List leads (supports filter params) |
| `GET` | `/api/leads/[id]` | Single lead with full analysis |
| `POST` | `/api/leads` | Create lead |
| `PUT` | `/api/leads/[id]` | Update status / notes |
| `DELETE` | `/api/leads/[id]` | Remove lead |
| `POST` | `/api/scrapers/hotel-search` | Trigger scrape + analyze for a city/type |

## Roadmap

- [ ] Google Places API for real hotel discovery (currently mock data)
- [ ] Background job queue for async scraping at scale
- [ ] CSV export
- [ ] Email open tracking and follow-up sequences
- [ ] Multi-user / team support
