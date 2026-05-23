'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Lead } from '@/lib/database/schema'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ExternalLink, Trash2, Edit } from 'lucide-react'

interface LeadTableProps {
  leads: Lead[]
  onDelete?: (id: string) => void
  isLoading?: boolean
}

const STATUS_COLORS: Record<string, 'blue' | 'green' | 'red' | 'yellow' | 'gray'> = {
  'New': 'blue',
  'Contacted': 'yellow',
  'Demo Scheduled': 'green',
  'Follow-Up': 'yellow',
  'Closed': 'green',
  'Dead': 'red',
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-gray-400">—</span>

  if (score >= 80) return <Badge variant="green">★★★★★ {score}</Badge>
  if (score >= 60) return <Badge variant="green">★★★★ {score}</Badge>
  if (score >= 40) return <Badge variant="yellow">★★★ {score}</Badge>
  return <Badge variant="red">★★ {score}</Badge>
}

export function LeadTable({ leads, onDelete, isLoading }: LeadTableProps) {
  const [selectedLead, setSelectedLead] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      onDelete?.(id)
      setSelectedLead(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <div className="px-6 py-12 text-center text-gray-500">Loading...</div>
      </Card>
    )
  }

  if (leads.length === 0) {
    return (
      <Card>
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No leads found. Start by searching for hotels.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Card>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Hotel
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">{lead.hotel_name}</p>
                      {lead.website && (
                        <a
                          href={`https://${lead.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                        >
                          <span>{lead.website}</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {lead.city}, {lead.state}
                </td>
                <td className="px-6 py-4">
                  <ScoreBadge score={lead.lead_score} />
                </td>
                <td className="px-6 py-4">
                  <Badge variant={STATUS_COLORS[lead.status]}>
                    {lead.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm">
                  {lead.primary_contact_name ? (
                    <div>
                      <p className="font-medium">{lead.primary_contact_name}</p>
                      {lead.primary_contact_email && (
                        <a
                          href={`mailto:${lead.primary_contact_email}`}
                          className="text-blue-600 text-xs hover:underline"
                        >
                          {lead.primary_contact_email}
                        </a>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Link href={`/leads/${lead.id}`}>
                      <Button size="sm" variant="ghost">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
