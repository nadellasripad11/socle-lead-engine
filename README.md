# Socle Lead Engine

AI-powered hospitality lead generation platform for finding, analyzing, scoring, and managing luxury hotel prospects.

## Features

- 🏨 **Hotel Lead Scraper** - Search and discover luxury hotels by city, state, and type
- 🤖 **AI Analysis** - Claude AI analyzes hotel websites for market fit and opportunity
- ⭐ **Lead Scoring** - Automatic 1-100 scoring based on luxury level, staff intensity, tipping potential
- 👥 **Contact Discovery** - Extract management emails and key decision-makers
- 📧 **Outreach Generation** - AI-generated personalized cold emails, call openers, LinkedIn messages
- 📊 **Lead Dashboard** - Manage and track all leads with status, notes, and analysis
- 📈 **Analytics** - View metrics on lead pipeline, score distribution, and top markets

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude API
- **Scraping:** Cheerio (HTML parsing), Axios (HTTP requests)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key

### Setup

1. **Clone and install dependencies**
   ```bash
   cd socle-lead-engine
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Create the database tables using the SQL from `/docs/schema.sql`
   - Copy your project URL and anon key

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `ANTHROPIC_API_KEY` - Your Claude API key

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser

## Usage

### Searching for Hotels

1. Go to **Search Hotels** tab
2. Enter city, state, hotel type (Luxury, Boutique, Resort, Chain)
3. Optionally add a keyword
4. Click "Search Hotels"

The system will:
- Find hotels matching your criteria
- Scrape their websites
- Analyze with Claude AI
- Generate lead scores and outreach templates
- Save everything to your dashboard

### Managing Leads

- **Leads Dashboard** - View all leads in a table
- **Lead Details** - Click any lead to see:
  - Full AI analysis breakdown
  - Lead score with reasoning
  - Extracted contacts
  - Personalized cold emails, call openers, LinkedIn messages
  - Your internal notes
  - Status tracking

### Analytics

View insights about your lead pipeline:
- Total leads and average score
- Score distribution
- Top cities by lead count
- Status breakdown
- Average hotel luxury level

## Database Schema

The app uses 4 main tables:

### leads
Main lead data with hotel info, analysis, contacts, and outreach templates

### website_cache
Cached website HTML (30-day TTL) to avoid re-scraping

### jobs (future)
Background job queue for async processing

### analysis_history (future)
Historical snapshots of lead analyses over time

## API Endpoints

### Leads
- `GET /api/leads` - List all leads (with filtering)
- `GET /api/leads/[id]` - Get single lead
- `POST /api/leads` - Create lead
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead

### Scrapers
- `POST /api/scrapers/hotel-search` - Search and analyze hotels

## Customization

### Modify Scoring

Edit `lib/analysis/scoring.ts` to change how lead scores are calculated based on:
- Luxury level
- Tipping platform fit
- Tipped departments
- Hiring signals
- Staff intensity
- Operational complexity

### Change Hotel Search

Currently uses mock data. To add real hotel search:
1. Integrate Google Places API in `lib/scrapers/hotelSearch.ts`
2. Add your API key to environment variables
3. Replace `MOCK_HOTELS` dataset

### Customize Claude Prompts

Edit `lib/analysis/prompts.ts` to change how Claude analyzes hotels and generates outreach

## Deployment

### Deploy to Vercel

```bash
npm run build
git push  # Vercel auto-deploys
```

Set environment variables in Vercel dashboard under project settings.

### Cost Optimization

- Claude API: ~$0.50-2 per hotel analyzed (depends on website size)
- Supabase: Free tier includes 500MB database
- Vercel: Free tier for hobby projects

Monitor Claude API usage to avoid unexpected costs.

## Roadmap

- [ ] Google Places API integration for real hotel search
- [ ] Background job queue (Bull Queue)
- [ ] Export leads to CSV
- [ ] Duplicate lead detection
- [ ] Call transcript analyzer
- [ ] Email tracking and follow-up automation
- [ ] Team collaboration and multi-user support
- [ ] Custom scoring rules

## Support

For issues or questions:
1. Check the logs: `npm run dev` shows errors
2. Verify environment variables are set correctly
3. Check Supabase console for database errors
4. Review Claude API usage in Anthropic dashboard

## License

MIT
