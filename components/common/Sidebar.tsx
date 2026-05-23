'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const NAVIGATION = [
  { href: '/leads', label: 'Leads' },
  { href: '/search', label: 'Search Hotels' },
  { href: '/analytics', label: 'Analytics' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-8">
          Navigation
        </h2>

        <nav className="space-y-2">
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'block px-4 py-2 rounded-lg transition-colors duration-200',
                pathname === item.href
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Socle Lead Engine
        </p>
        <p className="text-xs text-gray-500 mt-1">v0.1.0</p>
      </div>
    </aside>
  )
}
