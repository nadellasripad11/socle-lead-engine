'use client'

import React, { useEffect, useState } from 'react'
import { Lead } from '@/lib/database/schema'
import { LeadTable } from '@/components/dashboard/LeadTable'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    try {
      setLoading(true)
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads || [])
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = leads

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          lead.hotel_name.toLowerCase().includes(term) ||
          lead.website?.toLowerCase().includes(term) ||
          lead.primary_contact_email?.toLowerCase().includes(term)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, statusFilter])

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id))
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Leads</h1>
          <p className="text-gray-600 mt-1">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/search">
          <Button>
            <Plus size={18} className="mr-2" />
            Search Hotels
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by hotel name, website, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Demo Scheduled">Demo Scheduled</option>
              <option value="Follow-Up">Follow-Up</option>
              <option value="Closed">Closed</option>
              <option value="Dead">Dead</option>
            </select>

            {(searchTerm || statusFilter) && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <LeadTable
          leads={filteredLeads}
          onDelete={handleDelete}
          isLoading={loading}
        />
      )}
    </div>
  )
}
