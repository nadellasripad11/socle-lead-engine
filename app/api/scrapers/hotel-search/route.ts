import { NextRequest, NextResponse } from 'next/server'
import { searchHotels } from '@/lib/scrapers/hotelSearch'
import { scrapeHotelWebsite, extractPlainText } from '@/lib/scrapers/website'
import { analyzeHotel, extractContacts } from '@/lib/analysis/analyzer'
import { scoreLeadAI, scoreLeadBasic } from '@/lib/analysis/scoring'
import {
  generateColdEmail,
  generateColdCallOpener,
  generateLinkedInMessage,
} from '@/lib/outreach/generators'
import { createLead, checkLeadExists } from '@/lib/database/queries'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { city, state, hotelType = 'luxury', keyword = '' } = body

    if (!city || !state) {
      return NextResponse.json(
        { error: 'City and state are required' },
        { status: 400 }
      )
    }

    // Search for hotels
    const hotelResults = await searchHotels(city, state, hotelType, keyword)

    if (hotelResults.length === 0) {
      return NextResponse.json(
        { results: [] },
        { status: 200 }
      )
    }

    const results = []

    // Process each hotel
    for (const hotelResult of hotelResults) {
      try {
        // Check if lead already exists
        const exists = await checkLeadExists(hotelResult.name, city)
        if (exists) {
          results.push({
            name: hotelResult.name,
            city: hotelResult.city,
            state: hotelResult.state,
            score: null,
            status: 'Existing',
          })
          continue
        }

        // Scrape hotel website
        const webContent = hotelResult.website
          ? await scrapeHotelWebsite(hotelResult.website)
          : {
              homepage: '',
              about: '',
              careers: '',
              restaurant: '',
              contact: '',
              tippedDepartments: [],
              hiringSignals: [],
            }

        // Combine web content for analysis
        const combinedContent = [
          webContent.homepage,
          webContent.about,
          webContent.restaurant,
        ]
          .filter(Boolean)
          .join('\n\n')
          .substring(0, 8000)

        let analysis = null
        let score = null
        let contacts = null
        let coldEmail = null
        let coldCall = null
        let linkedinMessage = null

        // Only analyze if we have content
        if (combinedContent.trim()) {
          try {
            // Analyze with Claude
            analysis = await analyzeHotel(hotelResult.name, combinedContent)

            // Score the lead
            score = await scoreLeadAI(
              hotelResult.name,
              analysis,
              webContent.tippedDepartments,
              webContent.hiringSignals
            )

            // Extract contacts
            try {
              contacts = await extractContacts(
                hotelResult.name,
                [webContent.contact, webContent.homepage].join('\n\n')
              )
            } catch (err) {
              console.error('Error extracting contacts:', err)
            }

            // Generate outreach if we have a score
            if (score) {
              try {
                coldEmail = await generateColdEmail(
                  hotelResult.name,
                  city,
                  contacts?.primaryContactName || null,
                  analysis
                )

                coldCall = await generateColdCallOpener(
                  hotelResult.name,
                  city,
                  analysis
                )

                linkedinMessage = await generateLinkedInMessage(
                  hotelResult.name,
                  contacts?.primaryContactName || null,
                  analysis
                )
              } catch (err) {
                console.error('Error generating outreach:', err)
              }
            }
          } catch (err) {
            console.error('Error analyzing hotel:', err)
            // Fall back to basic scoring
            if (analysis) {
              score = scoreLeadBasic(
                hotelResult.name,
                analysis,
                webContent.tippedDepartments,
                webContent.hiringSignals
              )
            }
          }
        }

        // Create lead in database
        const lead = await createLead({
          hotel_name: hotelResult.name,
          website: hotelResult.website,
          phone: hotelResult.phone,
          address: hotelResult.address,
          city: hotelResult.city,
          state: hotelResult.state,
          google_rating: hotelResult.rating || null,
          analysis_json: analysis,
          lead_score: score?.score || null,
          cold_email_template: coldEmail || null,
          cold_call_opener: coldCall || null,
          linkedin_message: linkedinMessage || null,
          tipped_departments: webContent.tippedDepartments,
          hiring_signals: webContent.hiringSignals,
          primary_contact_name: contacts?.primaryContactName || null,
          primary_contact_email: contacts?.primaryContactEmail || null,
          operations_manager_name: contacts?.operationsManagerName || null,
          operations_manager_email: contacts?.operationsManagerEmail || null,
          fb_manager_name: contacts?.fbManagerName || null,
          fb_manager_email: contacts?.fbManagerEmail || null,
        })

        results.push({
          name: hotelResult.name,
          city: hotelResult.city,
          state: hotelResult.state,
          score: score?.score || null,
          status: 'New',
        })
      } catch (error) {
        console.error(`Error processing hotel ${hotelResult.name}:`, error)
        // Continue with next hotel
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error in hotel search:', error)
    return NextResponse.json(
      { error: 'Failed to search hotels' },
      { status: 500 }
    )
  }
}
