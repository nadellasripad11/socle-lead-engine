import axios from 'axios'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

export interface HotelSearchResult {
  name: string
  website: string | null
  phone: string | null
  address: string
  city: string
  state: string
  rating: number | null
  reviewCount: number | null
}

// For MVP: Using a mock dataset. In production, this would use Google Places API or similar
const MOCK_HOTELS: Record<string, HotelSearchResult[]> = {
  'atlanta_luxury': [
    {
      name: 'The St. Regis Atlanta',
      website: 'www.stregisatlanta.com',
      phone: '(404) 563-7900',
      address: '2619 Peachtree Rd NE',
      city: 'Atlanta',
      state: 'GA',
      rating: 4.8,
      reviewCount: 1200,
    },
    {
      name: 'Four Seasons Hotel Atlanta',
      website: 'www.fourseasons.com/atlanta',
      phone: '(404) 881-9898',
      address: '75 14th St',
      city: 'Atlanta',
      state: 'GA',
      rating: 4.7,
      reviewCount: 950,
    },
    {
      name: 'The Ritz-Carlton, Atlanta',
      website: 'www.ritzcarlton.com/atlanta',
      phone: '(404) 659-0400',
      address: '181 Peachtree St NE',
      city: 'Atlanta',
      state: 'GA',
      rating: 4.6,
      reviewCount: 1100,
    },
    {
      name: 'Mandarin Oriental Atlanta',
      website: 'www.mandarinoriental.com/atlanta',
      phone: '(404) 995-7500',
      address: '3376 Peachtree Rd NE',
      city: 'Atlanta',
      state: 'GA',
      rating: 4.7,
      reviewCount: 820,
    },
    {
      name: 'The Joule Atlanta',
      website: 'www.thejoulearltanta.com',
      phone: '(404) 688-3000',
      address: '260 15th St NW',
      city: 'Atlanta',
      state: 'GA',
      rating: 4.5,
      reviewCount: 650,
    },
  ],
  'miami_luxury': [
    {
      name: 'The Setai Miami Beach',
      website: 'www.thesetai.com',
      phone: '(305) 520-6000',
      address: '2001 Collins Ave',
      city: 'Miami',
      state: 'FL',
      rating: 4.8,
      reviewCount: 1500,
    },
    {
      name: 'Four Seasons Hotel Miami',
      website: 'www.fourseasons.com/miami',
      phone: '(305) 358-3535',
      address: '1435 Brickell Ave',
      city: 'Miami',
      state: 'FL',
      rating: 4.7,
      reviewCount: 1100,
    },
    {
      name: 'Pérez Art Museum Miami',
      website: 'www.pamm.org',
      phone: '(305) 375-3000',
      address: '1103 Biscayne Blvd',
      city: 'Miami',
      state: 'FL',
      rating: 4.6,
      reviewCount: 2000,
    },
  ],
  'new_york_luxury': [
    {
      name: 'The Plaza Hotel',
      website: 'www.theplazany.com',
      phone: '(212) 759-3000',
      address: '5th Ave at Central Park S',
      city: 'New York',
      state: 'NY',
      rating: 4.6,
      reviewCount: 2500,
    },
    {
      name: 'The St. Regis New York',
      website: 'www.stregisnewyork.com',
      phone: '(212) 753-4500',
      address: '2 E 55th St',
      city: 'New York',
      state: 'NY',
      rating: 4.7,
      reviewCount: 1800,
    },
    {
      name: 'Mandarin Oriental New York',
      website: 'www.mandarinoriental.com/newyork',
      phone: '(212) 805-8800',
      address: '80 Columbus Circle',
      city: 'New York',
      state: 'NY',
      rating: 4.8,
      reviewCount: 2200,
    },
  ],
}

export async function searchHotels(
  city: string,
  state: string,
  hotelType: string = 'luxury',
  keyword: string = ''
): Promise<HotelSearchResult[]> {
  try {
    // Create mock search key
    const searchKey = `${city.toLowerCase()}_${hotelType.toLowerCase()}`

    // Return mock results or empty array
    let results = MOCK_HOTELS[searchKey] || []

    // Filter by keyword if provided
    if (keyword) {
      const kw = keyword.toLowerCase()
      results = results.filter(
        (h) =>
          h.name.toLowerCase().includes(kw) ||
          h.address.toLowerCase().includes(kw)
      )
    }

    return results
  } catch (error) {
    console.error('Error searching hotels:', error)
    return []
  }
}

// This function would use Google Places API in production
export async function getHotelDetailsFromGooglePlaces(
  hotelName: string,
  city: string
): Promise<Partial<HotelSearchResult> | null> {
  // For MVP, we're skipping Google Places API
  // In production: call Google Places API for ratings, reviews, phone, website
  return null
}

export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10)
}

export function normalizeWebsite(website: string): string {
  if (!website) return ''
  return website
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/$/, '')
    .toLowerCase()
}
