'use client'

import React from 'react'
import { ScoreData } from '@/lib/database/schema'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface ScoreDisplayProps {
  score: ScoreData
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScorePercentage = (score: number) => {
    return (score / 100) * 360
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold text-gray-900">Lead Score</h3>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Score Circle */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${getScorePercentage(score.score)} 360`}
                className={getScoreColor(score.score)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
                  {score.score}
                </p>
                <p className="text-xs text-gray-500">/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reasons */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Why this score?</h4>
          <div className="space-y-2">
            {score.scoreReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <p className="text-sm text-gray-700">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Angle */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Recommended Sales Angle
          </h4>
          <p className="text-sm text-gray-700">{score.recommendedSalesAngle}</p>
        </div>

        {/* Breakdown */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Score Breakdown</h4>
          <div className="space-y-3">
            {Object.entries(score.breakdown).map(([key, value]) => {
              const label = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())

              return (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {label}
                    </span>
                    <span className="text-sm text-gray-600">{value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(value / 20) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
