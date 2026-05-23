import { callClaude } from '@/lib/claudeClient'
import { AnalysisData } from '@/lib/database/schema'
import {
  HOTEL_ANALYSIS_SYSTEM_PROMPT,
  HOTEL_ANALYSIS_PROMPT,
  CONTACT_EXTRACTION_SYSTEM_PROMPT,
  CONTACT_EXTRACTION_PROMPT,
} from './prompts'

export async function analyzeHotel(
  hotelName: string,
  webContent: string
): Promise<AnalysisData> {
  const prompt = HOTEL_ANALYSIS_PROMPT(hotelName, webContent)

  const response = await callClaude(
    prompt,
    HOTEL_ANALYSIS_SYSTEM_PROMPT,
    2000
  )

  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const data = JSON.parse(jsonMatch[0]) as AnalysisData
    return data
  } catch (error) {
    console.error('Failed to parse analysis response:', response)
    throw new Error('Failed to parse Claude analysis response')
  }
}

export interface ContactInfo {
  primaryContactName: string | null
  primaryContactEmail: string | null
  operationsManagerName: string | null
  operationsManagerEmail: string | null
  fbManagerName: string | null
  fbManagerEmail: string | null
  additionalContacts: Array<{
    name: string
    title: string
    email: string | null
  }>
}

export async function extractContacts(
  hotelName: string,
  webContent: string
): Promise<ContactInfo> {
  const prompt = CONTACT_EXTRACTION_PROMPT(hotelName, webContent)

  const response = await callClaude(
    prompt,
    CONTACT_EXTRACTION_SYSTEM_PROMPT,
    1500
  )

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const data = JSON.parse(jsonMatch[0]) as ContactInfo
    return data
  } catch (error) {
    console.error('Failed to parse contact extraction response:', response)
    throw new Error('Failed to parse Claude contact extraction response')
  }
}
