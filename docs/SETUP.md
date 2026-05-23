# Socle Lead Engine - Setup Guide

## Prerequisites

Before you start, you'll need:

1. **Node.js 18+** - Download from https://nodejs.org/
2. **npm** (comes with Node.js)
3. **Supabase Account** - Sign up at https://supabase.com (free tier)
4. **Anthropic API Key** - Get from https://console.anthropic.com/

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to https://supabase.com and sign up/log in
2. Create a new project:
   - Click "New project"
   - Name it "Socle Lead Engine"
   - Create a strong password
   - Choose your region (closest to you)
   - Click "Create new project"

3. Copy your credentials:
   - Go to Project Settings (gear icon) → API
   - Copy `URL` and `anon key` (you'll need these)

### 2. Create Database Tables

1. In Supabase, go to the SQL Editor
2. Click "New Query"
3. Copy the entire contents of `docs/schema.sql`
4. Paste it in the query editor
5. Click "Run"
6. You should see "Success" message

### 3. Get Claude API Key

1. Go to https://console.anthropic.com/
2. Sign up/log in with your Anthropic account
3. Go to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again)

### 4. Clone and Configure Project

```bash
# Navigate to where you want the project
cd /your/desired/path

# Copy the project
# (Already done in /Users/hnadella/Leads/socle-lead-engine)
cd socle-lead-engine

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 5. Set Environment Variables

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

Get these values from:
- **Supabase URL & Key**: Supabase → Settings → API
- **Claude API Key**: Anthropic console
- **App URL**: Leave as-is for local development

### 6. Start Development Server

```bash
npm run dev
```

You should see:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 7. Test the App

1. Open http://localhost:3000 in your browser
2. You should see the Leads dashboard
3. Click "Search Hotels"
4. Try searching: City "Atlanta", State "GA", Type "Luxury"
5. Click "Search Hotels"

The app will:
- Search for hotels
- Scrape their websites
- Analyze with Claude
- Generate scores and outreach
- Display results

## Troubleshooting

### "Failed to fetch leads" error

**Problem**: Can't connect to Supabase

**Solution**:
1. Check `.env.local` has correct URL and key
2. Verify Supabase project is active (check dashboard)
3. Check internet connection
4. Look at browser console for detailed error (F12)

### "ANTHROPIC_API_KEY is not set" error

**Problem**: Claude API key missing

**Solution**:
1. Verify `ANTHROPIC_API_KEY` is in `.env.local`
2. Check you copied the full key from Anthropic console
3. Don't commit `.env.local` to git

### Slow search results

**Problem**: Hotel search takes a long time

**This is normal** - the app:
1. Searches for hotels (instant with mock data)
2. Scrapes websites (5-15 seconds per hotel)
3. Analyzes with Claude (5-10 seconds per hotel)
4. Generates outreach (3-5 seconds per hotel)

**For MVP, expect 30-90 seconds for 5 hotels**

### Database errors

**Problem**: "relation 'leads' does not exist"

**Solution**:
1. Go to Supabase → SQL Editor
2. Run the schema.sql file again
3. Check for any error messages
4. Make sure you used `CREATE TABLE IF NOT EXISTS` syntax

## Next Steps

1. **Customize hotel search**: Edit `lib/scrapers/hotelSearch.ts` to add real hotel data or Google Places API integration
2. **Tune scoring**: Edit `lib/analysis/scoring.ts` to change scoring criteria
3. **Modify Claude prompts**: Edit `lib/analysis/prompts.ts` for different analysis style
4. **Deploy to Vercel**: `git push` to Vercel-connected repo for live deployment

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Connect your GitHub repo
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
6. Click "Deploy"

### Cost Estimates

- **Supabase**: Free tier sufficient for MVP (500MB database)
- **Vercel**: Free tier for hobby projects
- **Claude API**: ~$0.50-2 per hotel analyzed
  - Set budgets in Anthropic console to limit costs

## Support

If you run into issues:

1. Check browser console (F12) for error details
2. Check server logs (`npm run dev` output)
3. Verify all environment variables are set
4. Check Supabase dashboard for connectivity
5. Verify Claude API key is valid

## Quick Commands

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run linting
npm run type-check # Check TypeScript types
```

Good luck! 🚀
