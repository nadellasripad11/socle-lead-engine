'use client'

import React, { useState } from 'react'
import { SearchForm } from '@/components/dashboard/SearchForm'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface SearchResult {
  name: string
  city: string
  state: string
  score: number | null
  status: string
}

export default function SearchPage() {
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchParams, setSearchParams] = useState<{
    city: string
    state: string
    hotelType: string
    keyword: string
  } | null>(null)

  async function handleSearch(params: {
    city: string
    state: string
    hotelType: string
    keyword: string
  }) {
    try {
      setSearching(true)
      setSearchParams(params)
      setResults([])

      const response = await fetch('/api/scrapers/hotel-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error('Error searching hotels:', error)
      alert('Error searching hotels. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Search Hotels</h1>
        <p className="text-gray-600 mt-1">
          Find and analyze luxury hotels in your target markets
        </p>
      </div>

      <SearchForm onSearch={handleSearch} isLoading={searching} />

      {/* Results */}
      {searching && <LoadingSpinner />}

      {searchParams && !searching && results.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500">No hotels found for your search.</p>
          </CardBody>
        </Card>
      )}

      {results.length > 0 && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Found {results.length} hotel{results.length !== 1 ? 's' : ''} in{' '}
              {searchParams?.city}, {searchParams?.state}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((hotel) => (
              <Card key={`${hotel.name}-${hotel.city}`}>
                <CardBody>
                  <h3 className="font-bold text-gray-900 mb-2">{hotel.name}</h3>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      {hotel.city}, {hotel.state}
                    </p>

                    {hotel.score ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">Score:</span>
                        <Badge variant="green">{hotel.score}/100</Badge>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">
                        Analysis pending...
                      </p>
                    )}

                    <Badge variant="blue">{hotel.status}</Badge>
                  </div>

                  <Link href={`/leads`}>
                    <Button size="sm" className="w-full">
                      View in Leads
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
