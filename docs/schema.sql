-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_name TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'USA',
  hotel_type TEXT,
  estimated_category TEXT,
  google_rating DECIMAL(3, 1),
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Demo Scheduled', 'Follow-Up', 'Closed', 'Dead')),
  lead_score INT CHECK (lead_score >= 0 AND lead_score <= 100),

  -- AI Analysis
  analysis_json JSONB,
  tipped_departments TEXT[],
  hiring_signals TEXT[],

  -- Contact Info
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  operations_manager_name TEXT,
  operations_manager_email TEXT,
  fb_manager_name TEXT,
  fb_manager_email TEXT,

  -- Outreach
  cold_email_template TEXT,
  cold_call_opener TEXT,
  linkedin_message TEXT,
  follow_up_email TEXT,

  -- Management
  notes TEXT,
  last_contacted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_leads_city ON leads(city);
CREATE INDEX idx_leads_state ON leads(state);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(lead_score);
CREATE INDEX idx_leads_created ON leads(created_at);

-- Jobs table (for background processing)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type TEXT NOT NULL CHECK (job_type IN ('scrape_hotels', 'analyze_website', 'score_lead', 'extract_contacts', 'generate_outreach')),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  search_query TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result_json JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_lead ON jobs(lead_id);
CREATE INDEX idx_jobs_created ON jobs(created_at);

-- Website cache table
CREATE TABLE website_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT UNIQUE NOT NULL,
  homepage_html TEXT,
  about_page_html TEXT,
  careers_page_html TEXT,
  restaurant_page_html TEXT,
  contact_page_html TEXT,
  scraped_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_website_cache_url ON website_cache(url);
CREATE INDEX idx_website_cache_expires ON website_cache(expires_at);

-- Analysis history table
CREATE TABLE analysis_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  analysis_json JSONB,
  score INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_analysis_history_lead ON analysis_history(lead_id);
CREATE INDEX idx_analysis_history_created ON analysis_history(created_at);

-- Enable Row Level Security (optional, for multi-user support later)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for now (anyone can access)
CREATE POLICY "Allow all access to leads" ON leads
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to jobs" ON jobs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to website_cache" ON website_cache
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to analysis_history" ON analysis_history
  FOR ALL USING (true) WITH CHECK (true);
