import { callClaude } from '@/lib/claudeClient'
import {
  OUTREACH_EMAIL_SYSTEM_PROMPT,
  OUTREACH_EMAIL_PROMPT,
  OUTREACH_CALL_SYSTEM_PROMPT,
  OUTREACH_CALL_PROMPT,
  OUTREACH_LINKEDIN_SYSTEM_PROMPT,
  OUTREACH_LINKEDIN_PROMPT,
} from '@/lib/analysis/prompts'
import { AnalysisData } from '@/lib/database/schema'

export async function generateColdEmail(
  hotelName: string,
  city: string,
  contactName: string | null,
  analysis: AnalysisData
): Promise<string> {
  const analysisStr = JSON.stringify(analysis, null, 2)
  const prompt = OUTREACH_EMAIL_PROMPT(hotelName, city, contactName, analysisStr)

  const email = await callClaude(
    prompt,
    OUTREACH_EMAIL_SYSTEM_PROMPT,
    500
  )

  return email.trim()
}

export async function generateColdCallOpener(
  hotelName: string,
  city: string,
  analysis: AnalysisData
): Promise<string> {
  const analysisStr = JSON.stringify(analysis, null, 2)
  const prompt = OUTREACH_CALL_PROMPT(hotelName, city, analysisStr)

  const opener = await callClaude(
    prompt,
    OUTREACH_CALL_SYSTEM_PROMPT,
    300
  )

  return opener.trim()
}

export async function generateLinkedInMessage(
  hotelName: string,
  contactName: string | null,
  analysis: AnalysisData
): Promise<string> {
  const analysisStr = JSON.stringify(analysis, null, 2)
  const prompt = OUTREACH_LINKEDIN_PROMPT(hotelName, contactName, analysisStr)

  const message = await callClaude(
    prompt,
    OUTREACH_LINKEDIN_SYSTEM_PROMPT,
    250
  )

  return message.trim()
}

export async function generateFollowUpEmail(
  hotelName: string,
  contactName: string | null,
  daysFollowing: number = 3
): Promise<string> {
  const systemPrompt = `You are an expert at writing hospitality B2B follow-up emails.
Write a brief, friendly follow-up email that:
- References the initial outreach
- Adds new value (don't just repeat the pitch)
- Maintains professional but warm tone
- Has a clear CTA
Keep it under 100 words.`

  const prompt = `Write a follow-up email for ${contactName ? `${contactName} at ` : ''}${hotelName}.
This is sent ${daysFollowing} days after the initial outreach.
Make it valuable and not pushy.`

  const email = await callClaude(prompt, systemPrompt, 300)

  return email.trim()
}
