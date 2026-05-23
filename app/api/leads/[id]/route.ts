import { NextRequest, NextResponse } from 'next/server'
import { getLead, updateLead, deleteLead } from '@/lib/database/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await getLead(params.id)
    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { error: 'Lead not found' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const updates: Record<string, any> = {}

    if (body.status !== undefined) updates.status = body.status
    if (body.notes !== undefined) updates.notes = body.notes
    if (body.lead_score !== undefined) updates.lead_score = body.lead_score
    if (body.analysis_json !== undefined) updates.analysis_json = body.analysis_json
    if (body.cold_email_template !== undefined)
      updates.cold_email_template = body.cold_email_template
    if (body.cold_call_opener !== undefined)
      updates.cold_call_opener = body.cold_call_opener
    if (body.linkedin_message !== undefined)
      updates.linkedin_message = body.linkedin_message
    if (body.follow_up_email !== undefined)
      updates.follow_up_email = body.follow_up_email
    if (body.primary_contact_name !== undefined)
      updates.primary_contact_name = body.primary_contact_name
    if (body.primary_contact_email !== undefined)
      updates.primary_contact_email = body.primary_contact_email
    if (body.operations_manager_name !== undefined)
      updates.operations_manager_name = body.operations_manager_name
    if (body.operations_manager_email !== undefined)
      updates.operations_manager_email = body.operations_manager_email
    if (body.fb_manager_name !== undefined)
      updates.fb_manager_name = body.fb_manager_name
    if (body.fb_manager_email !== undefined)
      updates.fb_manager_email = body.fb_manager_email
    if (body.tipped_departments !== undefined)
      updates.tipped_departments = body.tipped_departments
    if (body.hiring_signals !== undefined)
      updates.hiring_signals = body.hiring_signals

    updates.updated_at = new Date().toISOString()

    const updated = await updateLead(params.id, updates)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteLead(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}
