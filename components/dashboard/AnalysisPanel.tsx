'use client'

import React from 'react'
import { AnalysisData } from '@/lib/database/schema'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface AnalysisPanelProps {
  analysis: AnalysisData
  tippedDepartments?: string[] | null
  hiringSignals?: string[] | null
}

function getLuxuryLevelLabel(level: number): string {
  if (level >= 9) return 'Ultra Luxury'
  if (level >= 7) return 'Luxury'
  if (level >= 5) return 'Upscale'
  if (level >= 3) return 'Mid-Range'
  return 'Budget'
}

function getLuxuryLevelColor(level: number): 'green' | 'blue' | 'yellow' | 'red' {
  if (level >= 8) return 'green'
  if (level >= 6) return 'blue'
  if (level >= 4) return 'yellow'
  return 'red'
}

export function AnalysisPanel({
  analysis,
  tippedDepartments,
  hiringSignals,
}: AnalysisPanelProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold text-gray-900">AI Analysis</h3>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Summary */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Hotel Type & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase text-gray-500 font-semibold mb-1 block">
              Hotel Type
            </label>
            <p className="font-medium text-gray-900">{analysis.hotelType}</p>
          </div>
          <div>
            <label className="text-xs uppercase text-gray-500 font-semibold mb-1 block">
              Luxury Level
            </label>
            <div className="flex items-center space-x-2">
              <Badge
                variant={getLuxuryLevelColor(analysis.luxuryLevel)}
              >
                {analysis.luxuryLevel}/10
              </Badge>
              <span className="text-sm text-gray-600">
                {getLuxuryLevelLabel(analysis.luxuryLevel)}
              </span>
            </div>
          </div>
        </div>

        {/* Guest Experience & Staffing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase text-gray-500 font-semibold mb-1 block">
              Guest Experience Focus
            </label>
            <p className="text-sm text-gray-700">{analysis.guestExperienceFocus}</p>
          </div>
          <div>
            <label className="text-xs uppercase text-gray-500 font-semibold mb-1 block">
              Staffing Intensity
            </label>
            <Badge variant="blue">{analysis.staffingIntensity}</Badge>
          </div>
        </div>

        {/* Platform Fit & Complexity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase text-gray-500 font-semibold mb-1 block">
              Platform Fit
            </label>
            <div className="flex items-center space-x-2">
              <Badge variant={analysis.tipPlatformLikelihood >= 7 ? 'green' : 'yellow'}>
                {analysis.tipPlatformLikelihood}/10
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase text-gray-500 font-semibold mb-1 block">
              Operational Complexity
            </label>
            <Badge variant="blue">{analysis.operationalComplexity}</Badge>
          </div>
        </div>

        {/* Key Factors */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Key Factors</h4>
          <div className="space-y-2">
            {analysis.keyFactors.map((factor, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-sm text-gray-700">{factor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tipped Departments */}
        {tippedDepartments && tippedDepartments.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Tipped Departments</h4>
            <div className="flex flex-wrap gap-2">
              {tippedDepartments.map((dept) => (
                <Badge key={dept} variant="green">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Hiring Signals */}
        {hiringSignals && hiringSignals.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Hiring Signals</h4>
            <div className="flex flex-wrap gap-2">
              {hiringSignals.map((signal) => (
                <Badge key={signal} variant="yellow">
                  {signal}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
