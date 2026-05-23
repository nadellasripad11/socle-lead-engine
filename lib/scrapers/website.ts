import axios from 'axios'
import * as cheerio from 'cheerio'
import { getWebsiteCache, cacheWebsite } from '@/lib/database/queries'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

async function fetchUrl(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
      },
      timeout: 10000,
      maxRedirects: 5,
    })
    return response.data
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error)
    return ''
  }
}

function findPageUrl(baseUrl: string, keywords: string[]): string {
  const url = new URL(baseUrl)
  const pathSegments = url.pathname.split('/').filter(Boolean)

  // Try common paths
  for (const keyword of keywords) {
    return `${url.origin}/${keyword}`
  }

  return baseUrl
}

export interface ScrapedWebsiteContent {
  homepage: string
  about: string
  careers: string
  restaurant: string
  contact: string
  tippedDepartments: string[]
  hiringSignals: string[]
}

export async function scrapeHotelWebsite(
  website: string
): Promise<ScrapedWebsiteContent> {
  try {
    // Check cache first
    const cached = await getWebsiteCache(website)
    if (cached) {
      return {
        homepage: cached.homepage_html || '',
        about: cached.about_page_html || '',
        careers: cached.careers_page_html || '',
        restaurant: cached.restaurant_page_html || '',
        contact: cached.contact_page_html || '',
        tippedDepartments: extractTippedDepartments(
          [cached.homepage_html, cached.restaurant_page_html].join('\n')
        ),
        hiringSignals: extractHiringSignals(cached.careers_page_html || ''),
      }
    }

    const baseUrl = website.startsWith('http') ? website : `https://${website}`

    // Fetch all pages in parallel
    const [homepage, about, careers, restaurant, contact] = await Promise.all([
      fetchUrl(baseUrl),
      fetchUrl(findPageUrl(baseUrl, ['about', 'about-us', 'our-story'])),
      fetchUrl(findPageUrl(baseUrl, ['careers', 'jobs', 'join-us', 'work-with-us'])),
      fetchUrl(findPageUrl(baseUrl, ['restaurant', 'dining', 'food', 'bar'])),
      fetchUrl(findPageUrl(baseUrl, ['contact', 'contact-us', 'reservations'])),
    ])

    // Extract signals
    const tippedDepartments = extractTippedDepartments(
      [homepage, restaurant].join('\n')
    )
    const hiringSignals = extractHiringSignals(careers)

    const result: ScrapedWebsiteContent = {
      homepage,
      about,
      careers,
      restaurant,
      contact,
      tippedDepartments,
      hiringSignals,
    }

    // Cache the results
    await cacheWebsite({
      url: website,
      homepage_html: homepage,
      about_page_html: about,
      careers_page_html: careers,
      restaurant_page_html: restaurant,
      contact_page_html: contact,
    })

    return result
  } catch (error) {
    console.error(`Error scraping ${website}:`, error)
    return {
      homepage: '',
      about: '',
      careers: '',
      restaurant: '',
      contact: '',
      tippedDepartments: [],
      hiringSignals: [],
    }
  }
}

export function extractTippedDepartments(html: string): string[] {
  const $ = cheerio.load(html)
  const departments = new Set<string>()

  const keywords = {
    'Restaurant/Dining': ['restaurant', 'dining', 'fine dining', 'cuisine'],
    'Bar/Lounge': ['bar', 'lounge', 'cocktail', 'nightlife'],
    'Room Service': ['room service', 'in-room dining', 'order to room'],
    'Housekeeping': ['housekeeping', 'maid', 'cleaning'],
    'Valet': ['valet', 'parking', 'car service'],
    'Spa/Wellness': ['spa', 'massage', 'wellness', 'fitness'],
    'Concierge': ['concierge', 'guest services', 'bell desk'],
  }

  const text = $.text().toLowerCase()

  for (const [dept, kws] of Object.entries(keywords)) {
    if (kws.some((kw) => text.includes(kw))) {
      departments.add(dept)
    }
  }

  return Array.from(departments)
}

export function extractHiringSignals(html: string): string[] {
  const $ = cheerio.load(html)
  const signals = new Set<string>()

  const keywords = {
    'Active Hiring': ['now hiring', 'open positions', 'join our team', 'career opportunities'],
    'Job Listings': ['apply here', 'submit resume', 'job application'],
    'Growth': ['expansion', 'new property', 'new location'],
    'Development Programs': ['training', 'development', 'certification', 'apprenticeship'],
  }

  const text = $.text().toLowerCase()

  for (const [signal, kws] of Object.entries(keywords)) {
    if (kws.some((kw) => text.includes(kw))) {
      signals.add(signal)
    }
  }

  return Array.from(signals)
}

export function extractPlainText(html: string, maxLength: number = 5000): string {
  const $ = cheerio.load(html)

  // Remove script and style tags
  $('script, style, nav, footer').remove()

  const text = $.text()
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLength)

  return text
}
