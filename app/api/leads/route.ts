import { NextRequest, NextResponse } from 'next/server'
import { getLeads, createLead, updateLead } from '@/lib/database/queries'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const minScore = searchParams.get('minScore')
      ? parseInt(searchParams.get('minScore')!)
      : undefined
    const city = searchParams.get('city') || undefined
    const search = searchParams.get('search') || undefined

    const leads = await getLeads({
      status: status,
      minScore: minScore,
      city: city,
      search: search,
    })

    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const lead = await createLead({
      hotel_name: body.hotelName || body.hotel_name,
      website: body.website,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country || 'USA',
      hotel_type: body.hotelType || body.hotel_type,
      estimated_category: body.estimatedCategory || body.estimated_category,
      google_rating: body.googleRating || body.google_rating,
      status: 'New',
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
