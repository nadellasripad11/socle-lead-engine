'use client'

import React from 'react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Socle</span>
          </Link>

          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">Hospitality Lead Engine</p>
          </div>
        </div>
      </div>
    </header>
  )
}
