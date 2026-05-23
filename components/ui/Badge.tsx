import React from 'react'
import clsx from 'clsx'

interface BadgeProps {
  variant?: 'blue' | 'green' | 'red' | 'yellow' | 'gray'
  children: React.ReactNode
}

export function Badge({ variant = 'blue', children }: BadgeProps) {
  const variants = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={clsx(
        'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant]
      )}
    >
      {children}
    </span>
  )
}
