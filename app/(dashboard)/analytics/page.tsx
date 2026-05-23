'use client'

import React, { useEffect, useState } from 'react'
import { Lead } from '@/lib/database/schema'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface Analytics {
  totalLeads: number
  averageScore: number
  scoreDistribution: { score: string; count: number }[]
  topCities: { city: string; count: number }[]
  statusBreakdown: Record<string, number>
  averageLuxuryLevel: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      setLoading(true)
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        const leads: Lead[] = data.leads || []

        // Calculate analytics
        const totalLeads = leads.length
        const scoredLeads = leads.filter((l) => l.lead_score !== null)
        const averageScore =
          scoredLeads.length > 0
            ? Math.round(
                scoredLeads.reduce((sum, l) => sum + (l.lead_score || 0), 0) /
                  scoredLeads.length
              )
            : 0

        // Score distribution
        const scoreDistribution = [
          {
            score: '80-100 (Excellent)',
            count: scoredLeads.filter((l) => (l.lead_score || 0) >= 80).length,
          },
          {
            score: '60-79 (Good)',
            count: scoredLeads.filter(
              (l) => (l.lead_score || 0) >= 60 && (l.lead_score || 0) < 80
            ).length,
          },
          {
            score: '40-59 (Fair)',
            count: scoredLeads.filter(
              (l) => (l.lead_score || 0) >= 40 && (l.lead_score || 0) < 60
            ).length,
          },
          {
            score: '0-39 (Poor)',
            count: scoredLeads.filter((l) => (l.lead_score || 0) < 40).length,
          },
        ]

        // Top cities
        const cityMap: Record<string, number> = {}
        leads.forEach((l) => {
          const key = `${l.city}, ${l.state}`
          cityMap[key] = (cityMap[key] || 0) + 1
        })
        const topCities = Object.entries(cityMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([city, count]) => ({ city, count }))

        // Status breakdown
        const statusBreakdown: Record<string, number> = {}
        leads.forEach((l) => {
          statusBreakdown[l.status] = (statusBreakdown[l.status] || 0) + 1
        })

        // Average luxury level
        const luxuryLeads = leads.filter(
          (l) => l.analysis_json && l.analysis_json.luxuryLevel
        )
        const averageLuxuryLevel =
          luxuryLeads.length > 0
            ? Math.round(
                luxuryLeads.reduce(
                  (sum, l) => sum + (l.analysis_json?.luxuryLevel || 0),
                  0
                ) / luxuryLeads.length
              )
            : 0

        setAnalytics({
          totalLeads,
          averageScore,
          scoreDistribution,
          topCities,
          statusBreakdown,
          averageLuxuryLevel,
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!analytics) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-gray-500">No data available</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Analytics</h1>
        <p className="text-gray-600 mt-1">
          Insights about your lead pipeline
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {analytics.totalLeads}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Leads</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {analytics.averageScore}
            </p>
            <p className="text-sm text-gray-600 mt-1">Average Score</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {analytics.averageLuxuryLevel}/10
            </p>
            <p className="text-sm text-gray-600 mt-1">Avg. Luxury Level</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {analytics.topCities.length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Cities Covered</p>
          </CardBody>
        </Card>
      </div>

      {/* Score Distribution & Top Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">Score Distribution</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {analytics.scoreDistribution.map((item) => (
              <div key={item.score}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.score}
                  </span>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        analytics.totalLeads > 0
                          ? (item.count / analytics.totalLeads) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-900">Top Cities</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {analytics.topCities.map((item) => (
              <div key={item.city} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{item.city}</span>
                <Badge variant="blue">{item.count} leads</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-900">Status Breakdown</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
              <div key={status} className="text-center">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-xs text-gray-600 mt-1">{status}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
