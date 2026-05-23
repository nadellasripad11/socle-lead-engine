'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

interface SearchFormProps {
  onSearch: (params: {
    city: string
    state: string
    hotelType: string
    keyword: string
  }) => void
  isLoading?: boolean
}

export function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [formData, setFormData] = useState({
    city: 'Atlanta',
    state: 'GA',
    hotelType: 'luxury',
    keyword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(formData)
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-900">Search Hotels</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., Atlanta"
              required
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g., GA"
              required
              maxLength={2}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hotel Type
              </label>
              <select
                name="hotelType"
                value={formData.hotelType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="luxury">Luxury</option>
                <option value="boutique">Boutique</option>
                <option value="resort">Resort</option>
                <option value="chain">Chain</option>
              </select>
            </div>

            <Input
              label="Keyword (optional)"
              name="keyword"
              value={formData.keyword}
              onChange={handleChange}
              placeholder="e.g., five-star"
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Searching...' : 'Search Hotels'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
