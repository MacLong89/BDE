import { differenceInDays, parseISO } from 'date-fns'
import type { AppData, Candidate, Company } from '../types'

export type ReminderType = 'company_followup' | 'candidate_followup' | 'linkedin_check'

export interface Reminder {
  id: string
  type: ReminderType
  title: string
  description: string
  entityId: string
  daysOverdue: number
  priority: 'high' | 'medium' | 'low'
  actionUrl?: string
}

function daysSince(dateStr?: string): number | null {
  if (!dateStr) return null
  return differenceInDays(new Date(), parseISO(dateStr))
}

function getFollowUpReminder(
  entity: Company | Candidate,
  type: 'company_followup' | 'candidate_followup',
  name: string,
): Reminder | null {
  const days = daysSince(entity.lastContactedAt)
  if (days === null) {
    return {
      id: `${type}-${entity.id}-never`,
      type,
      title: `Never contacted: ${name}`,
      description: `You haven't logged any outreach to ${name} yet.`,
      entityId: entity.id,
      daysOverdue: 999,
      priority: 'medium',
    }
  }
  if (days >= entity.followUpDays) {
    const overdue = days - entity.followUpDays
    return {
      id: `${type}-${entity.id}`,
      type,
      title: `Follow up with ${name}`,
      description: `Last contact was ${days} day${days === 1 ? '' : 's'} ago (target: every ${entity.followUpDays} days).`,
      entityId: entity.id,
      daysOverdue: overdue,
      priority: overdue >= 7 ? 'high' : overdue >= 3 ? 'medium' : 'low',
    }
  }
  return null
}

function getLinkedInReminder(company: Company, checkDays: number): Reminder | null {
  if (!company.linkedInJobsUrl) return null
  const days = daysSince(company.lastLinkedInCheckAt)
  if (days === null || days >= checkDays) {
    const overdue = days === null ? checkDays : days - checkDays
    return {
      id: `linkedin-${company.id}`,
      type: 'linkedin_check',
      title: `Check LinkedIn jobs: ${company.name}`,
      description:
        days === null
          ? `You haven't checked ${company.name}'s LinkedIn jobs page yet.`
          : `Last LinkedIn check was ${days} day${days === 1 ? '' : 's'} ago.`,
      entityId: company.id,
      daysOverdue: overdue,
      priority: overdue >= 5 ? 'high' : 'medium',
      actionUrl: company.linkedInJobsUrl,
    }
  }
  return null
}

export function computeReminders(data: AppData): Reminder[] {
  const reminders: Reminder[] = []

  for (const company of data.companies) {
    if (!['not_interested', 'on_hold'].includes(company.status)) {
      const followUp = getFollowUpReminder(company, 'company_followup', company.name)
      if (followUp) reminders.push(followUp)
    }
    const linkedIn = getLinkedInReminder(company, data.settings.linkedInCheckDays)
    if (linkedIn) reminders.push(linkedIn)
  }

  for (const candidate of data.candidates) {
    if (!['placed', 'not_interested'].includes(candidate.status)) {
      const followUp = getFollowUpReminder(
        candidate,
        'candidate_followup',
        candidate.name,
      )
      if (followUp) reminders.push(followUp)
    }
  }

  return reminders.sort((a, b) => b.daysOverdue - a.daysOverdue)
}
