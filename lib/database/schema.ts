export interface Lead {
  id: string
  hotel_name: string
  website: string | null
  phone: string | null
  address: string | null
  city: string
  state: string
  country: string
  hotel_type: string | null
  estimated_category: string | null
  google_rating: number | null
  status: 'New' | 'Contacted' | 'Demo Scheduled' | 'Follow-Up' | 'Closed' | 'Dead'
  lead_score: number | null

  // AI Analysis
  analysis_json: AnalysisData | null
  tipped_departments: string[] | null
  hiring_signals: string[] | null

  // Contact Info
  primary_contact_name: string | null
  primary_contact_email: string | null
  operations_manager_name: string | null
  operations_manager_email: string | null
  fb_manager_name: string | null
  fb_manager_email: string | null

  // Outreach
  cold_email_template: string | null
  cold_call_opener: string | null
  linkedin_message: string | null
  follow_up_email: string | null

  // Management
  notes: string | null
  last_contacted_at: string | null
  created_at: string
  updated_at: string
}

export interface AnalysisData {
  hotelType: string
  luxuryLevel: number // 1-10
  guestExperienceFocus: string
  staffingIntensity: string // low, medium, high
  tipPlatformLikelihood: number // 1-10
  operationalComplexity: string
  isStrongLead: boolean
  summary: string
  keyFactors: string[]
}

export interface ScoreData {
  score: number // 1-100
  scoreReasons: string[]
  recommendedSalesAngle: string
  breakdown: {
    tippedDepartments: number
    restaurantPresence: number
    hiringActivity: number
    luxuryBranding: number
    guestExperienceLanguage: number
    operationalScale: number
  }
}

export interface OutreachData {
  coldEmail: string
  coldCallOpener: string
  linkedinMessage: string
  followUpEmail: string
}

export interface ContactInfo {
  primaryContactName: string | null
  primaryContactEmail: string | null
  operationsManagerName: string | null
  operationsManagerEmail: string | null
  fbManagerName: string | null
  fbManagerEmail: string | null
}

export interface Job {
  id: string
  job_type: 'scrape_hotels' | 'analyze_website' | 'score_lead' | 'extract_contacts' | 'generate_outreach'
  lead_id: string | null
  search_query: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result_json: Record<string, any> | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface WebsiteCache {
  id: string
  url: string
  homepage_html: string | null
  about_page_html: string | null
  careers_page_html: string | null
  restaurant_page_html: string | null
  contact_page_html: string | null
  scraped_at: string
  expires_at: string | null
}

export interface AnalysisHistory {
  id: string
  lead_id: string
  analysis_json: AnalysisData | null
  score: number | null
  created_at: string
}
