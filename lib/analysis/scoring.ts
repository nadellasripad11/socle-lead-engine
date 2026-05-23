import { callClaude } from '@/lib/claudeClient'
import { ScoreData, AnalysisData } from '@/lib/database/schema'
import {
  LEAD_SCORING_SYSTEM_PROMPT,
  LEAD_SCORING_PROMPT,
} from './prompts'

export async function scoreLeadAI(
  hotelName: string,
  analysis: AnalysisData,
  tippedDepartments: string[] | null,
  hiringSignals: string[] | null
): Promise<ScoreData> {
  const tippedDeptStr = tippedDepartments?.join(', ') || 'Unknown'
  const hiringSignalStr = hiringSignals?.join(', ') || 'None detected'
  const analysisStr = JSON.stringify(analysis, null, 2)

  const prompt = LEAD_SCORING_PROMPT(
    hotelName,
    analysisStr,
    tippedDeptStr,
    hiringSignalStr
  )

  const response = await callClaude(
    prompt,
    LEAD_SCORING_SYSTEM_PROMPT,
    1500
  )

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const data = JSON.parse(jsonMatch[0]) as ScoreData
    return data
  } catch (error) {
    console.error('Failed to parse scoring response:', response)
    throw new Error('Failed to parse Claude scoring response')
  }
}

// Simple rule-based scoring as fallback
export function scoreLeadBasic(
  hotelName: string,
  analysis: AnalysisData,
  tippedDepartments: string[] | null,
  hiringSignals: string[] | null
): ScoreData {
  let score = 50 // base score

  // Luxury level (up to +20)
  score += Math.min(analysis.luxuryLevel * 2, 20)

  // Tipping likelihood (up to +20)
  score += Math.min(analysis.tipPlatformLikelihood * 2, 20)

  // Tipped departments (up to +15)
  const deptCount = tippedDepartments?.length || 0
  score += Math.min(deptCount * 5, 15)

  // Hiring signals (up to +10)
  const hiringCount = hiringSignals?.length || 0
  score += Math.min(hiringCount * 3, 10)

  // Staffing intensity (up to +5)
  if (analysis.staffingIntensity === 'high') score += 5
  else if (analysis.staffingIntensity === 'medium') score += 3

  // Operational complexity (up to +5)
  if (analysis.operationalComplexity === 'complex') score += 5
  else if (analysis.operationalComplexity === 'moderate') score += 3

  // Cap at 100
  score = Math.min(score, 100)

  return {
    score,
    scoreReasons: [
      `Luxury level: ${analysis.luxuryLevel}/10`,
      `Tipping platform fit: ${analysis.tipPlatformLikelihood}/10`,
      `${deptCount} tipped departments identified`,
      `${hiringCount} hiring signals detected`,
      analysis.isStrongLead ? 'Strong lead indicator' : 'Moderate lead potential',
    ],
    recommendedSalesAngle: analysis.isStrongLead
      ? 'Emphasize guest satisfaction metrics and staff retention benefits'
      : 'Focus on operational efficiency and feedback gathering',
    breakdown: {
      tippedDepartments: Math.min(deptCount * 5, 15),
      restaurantPresence: analysis.guestExperienceFocus.toLowerCase().includes('restaurant') ? 10 : 5,
      hiringActivity: Math.min(hiringCount * 3, 10),
      luxuryBranding: Math.min(analysis.luxuryLevel * 2, 20),
      guestExperienceLanguage: analysis.guestExperienceFocus.length > 100 ? 10 : 5,
      operationalScale: analysis.operationalComplexity === 'complex' ? 15 : 10,
    },
  }
}
