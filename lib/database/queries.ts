import { supabase } from '@/lib/supabase'
import { Lead, Job, WebsiteCache, AnalysisHistory } from './schema'

// LEADS
export async function getLeads(filters?: {
  status?: string
  minScore?: number
  city?: string
  search?: string
}) {
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.minScore !== undefined) {
    query = query.gte('lead_score', filters.minScore)
  }
  if (filters?.city) {
    query = query.eq('city', filters.city)
  }
  if (filters?.search) {
    query = query.or(
      `hotel_name.ilike.%${filters.search}%,website.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query
  if (error) throw error
  return data as Lead[]
}

export async function getLead(id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Lead
}

export async function createLead(lead: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single()
  if (error) throw error
  return data as Lead
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Lead
}

export async function deleteLead(id: string) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function checkLeadExists(hotelName: string, city: string) {
  const { data } = await supabase
    .from('leads')
    .select('id')
    .eq('hotel_name', hotelName)
    .eq('city', city)
    .limit(1)
  return data && data.length > 0
}

// JOBS
export async function createJob(job: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select()
    .single()
  if (error) throw error
  return data as Job
}

export async function getPendingJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Job[]
}

export async function updateJob(id: string, updates: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Job
}

// WEBSITE CACHE
export async function getWebsiteCache(url: string) {
  const { data, error } = await supabase
    .from('website_cache')
    .select('*')
    .eq('url', url)
    .single()
  if (error && error.code === 'PGRST116') return null
  if (error) throw error

  if (data) {
    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return null // Cache expired
    }
  }

  return data as WebsiteCache | null
}

export async function cacheWebsite(cache: Partial<WebsiteCache>) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 day TTL

  const { data, error } = await supabase
    .from('website_cache')
    .upsert([{ ...cache, expires_at: expiresAt.toISOString() }])
    .select()
    .single()
  if (error) throw error
  return data as WebsiteCache
}

// ANALYSIS HISTORY
export async function createAnalysisHistory(history: Partial<AnalysisHistory>) {
  const { data, error } = await supabase
    .from('analysis_history')
    .insert([history])
    .select()
    .single()
  if (error) throw error
  return data as AnalysisHistory
}

export async function getAnalysisHistory(leadId: string) {
  const { data, error } = await supabase
    .from('analysis_history')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as AnalysisHistory[]
}
