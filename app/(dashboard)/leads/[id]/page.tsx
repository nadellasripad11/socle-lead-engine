'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Lead, ScoreData, AnalysisData } from '@/lib/database/schema'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ScoreDisplay } from '@/components/dashboard/ScoreDisplay'
import { AnalysisPanel } from '@/components/dashboard/AnalysisPanel'
import { OutreachPanel } from '@/components/dashboard/OutreachPanel'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function LeadDetailPage() {
  const params = useParams()
  const leadId = params.id as string
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchLead()
  }, [leadId])

  async function fetchLead() {
    try {
      setLoading(true)
      const response = await fetch(`/api/leads/${leadId}`)
      if (response.ok) {
        const data = await response.json()
        setLead(data)
        setNotes(data.notes || '')
      }
    } catch (error) {
      console.error('Error fetching lead:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(newStatus: string) {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        const updated = await response.json()
        setLead(updated)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  async function handleUpdateNotes() {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      if (response.ok) {
        setEditing(false)
        const updated = await response.json()
        setLead(updated)
      }
    } catch (error) {
      console.error('Error updating notes:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead not found</p>
        <Link href="/leads">
          <Button className="mt-4">Back to Leads</Button>
        </Link>
      </div>
    )
  }

  const analysis = lead.analysis_json as AnalysisData | null
  const score: ScoreData = {
    score: lead.lead_score || 0,
    scoreReasons: [],
    recommendedSalesAngle: '',
    breakdown: {
      tippedDepartments: 0,
      restaurantPresence: 0,
      hiringActivity: 0,
      luxuryBranding: 0,
      guestExperienceLanguage: 0,
      operationalScale: 0,
    },
  }

  const STATUS_OPTIONS = [
    'New',
    'Contacted',
    'Demo Scheduled',
    'Follow-Up',
    'Closed',
    'Dead',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/leads">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div className="flex-1">
          <h1>{lead.hotel_name}</h1>
          <div className="flex items-center space-x-3 mt-2">
            {lead.website && (
              <a
                href={`https://${lead.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center space-x-1"
              >
                <span className="text-sm">{lead.website}</span>
                <ExternalLink size={14} />
              </a>
            )}
            <span className="text-sm text-gray-600">
              {lead.city}, {lead.state}
            </span>
          </div>
        </div>
      </div>

      {/* Status & Basic Info */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase text-gray-500 font-semibold mb-2">
                Status
              </label>
              <select
                value={lead.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-gray-500 font-semibold mb-2">
                Phone
              </label>
              <a
                href={`tel:${lead.phone}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {lead.phone || '—'}
              </a>
            </div>

            <div>
              <label className="block text-xs uppercase text-gray-500 font-semibold mb-2">
                Rating
              </label>
              <p className="font-medium">
                {lead.google_rating ? `⭐ ${lead.google_rating}/5` : '—'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Analysis & Outreach */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score */}
          {lead.lead_score && <ScoreDisplay score={score} />}

          {/* Analysis */}
          {analysis && (
            <AnalysisPanel
              analysis={analysis}
              tippedDepartments={lead.tipped_departments}
              hiringSignals={lead.hiring_signals}
            />
          )}

          {/* Outreach */}
          <OutreachPanel lead={lead} />
        </div>

        {/* Right Column - Contact & Notes */}
        <div className="space-y-6">
          {/* Contact Information */}
          {(lead.primary_contact_name ||
            lead.operations_manager_name ||
            lead.fb_manager_name) && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900">Contacts</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {lead.primary_contact_name && (
                  <div>
                    <label className="text-xs uppercase text-gray-500 font-semibold">
                      Primary Contact
                    </label>
                    <p className="font-medium text-gray-900">
                      {lead.primary_contact_name}
                    </p>
                    {lead.primary_contact_email && (
                      <a
                        href={`mailto:${lead.primary_contact_email}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {lead.primary_contact_email}
                      </a>
                    )}
                  </div>
                )}

                {lead.operations_manager_name && (
                  <div>
                    <label className="text-xs uppercase text-gray-500 font-semibold">
                      Operations Manager
                    </label>
                    <p className="font-medium text-gray-900">
                      {lead.operations_manager_name}
                    </p>
                    {lead.operations_manager_email && (
                      <a
                        href={`mailto:${lead.operations_manager_email}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {lead.operations_manager_email}
                      </a>
                    )}
                  </div>
                )}

                {lead.fb_manager_name && (
                  <div>
                    <label className="text-xs uppercase text-gray-500 font-semibold">
                      Food & Beverage Manager
                    </label>
                    <p className="font-medium text-gray-900">
                      {lead.fb_manager_name}
                    </p>
                    {lead.fb_manager_email && (
                      <a
                        href={`mailto:${lead.fb_manager_email}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {lead.fb_manager_email}
                      </a>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-900">Notes</h3>
            </CardHeader>
            <CardBody>
              {editing ? (
                <div className="space-y-4">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-40"
                    placeholder="Add internal notes..."
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleUpdateNotes}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditing(false)
                        setNotes(lead.notes || '')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {notes ? (
                    <p className="text-gray-700 text-sm">{notes}</p>
                  ) : (
                    <p className="text-gray-400 text-sm">No notes yet</p>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(true)}
                    className="mt-2"
                  >
                    Edit Notes
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
