'use client'

import React, { useState } from 'react'
import { Lead } from '@/lib/database/schema'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Copy, Mail, Phone, Linkedin } from 'lucide-react'

interface OutreachPanelProps {
  lead: Lead
}

function CopyableContent({
  title,
  icon: Icon,
  content,
}: {
  title: string
  icon: React.ComponentType<{ size: number }>
  content?: string | null
}) {
  const [copied, setCopied] = useState(false)

  if (!content) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 text-gray-500">
          <Icon size={18} />
          <p className="text-sm font-medium">{title}</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">Not generated yet</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon size={18} className="text-blue-600" />
          <p className="text-sm font-semibold text-gray-900">{title}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
        >
          <Copy size={16} />
        </Button>
      </div>
      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
      {copied && <p className="text-xs text-green-600 mt-2">Copied!</p>}
    </div>
  )
}

export function OutreachPanel({ lead }: OutreachPanelProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold text-gray-900">Outreach Templates</h3>
        <p className="text-sm text-gray-600 mt-1">
          AI-generated, personalized outreach messages. Feel free to edit before using.
        </p>
      </CardHeader>
      <CardBody className="space-y-4">
        <CopyableContent
          title="Cold Email"
          icon={Mail}
          content={lead.cold_email_template}
        />

        <CopyableContent
          title="Cold Call Opener"
          icon={Phone}
          content={lead.cold_call_opener}
        />

        <CopyableContent
          title="LinkedIn Message"
          icon={Linkedin}
          content={lead.linkedin_message}
        />

        <CopyableContent
          title="Follow-up Email"
          icon={Mail}
          content={lead.follow_up_email}
        />
      </CardBody>
    </Card>
  )
}
