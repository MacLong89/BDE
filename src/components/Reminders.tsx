import { Bell, Building2, ExternalLink, UserCircle } from 'lucide-react'
import { useMemo } from 'react'
import { SHOW_CANDIDATES } from '../constants/features'
import { useApp } from '../store/AppContext'
import { computeReminders } from '../utils/reminders'
import { Button } from './ui/Button'

const typeIcons = {
  company_followup: Building2,
  candidate_followup: UserCircle,
  linkedin_check: ExternalLink,
}

const priorityStyles = {
  high: 'border-l-red-500 bg-red-50/50',
  medium: 'border-l-amber-500 bg-amber-50/50',
  low: 'border-l-slate-300 bg-white',
}

export function Reminders() {
  const { data, setView, markCompanyContacted, markCandidateContacted, markLinkedInChecked } =
    useApp()

  const reminders = useMemo(
    () =>
      computeReminders(data).filter(
        (r) => SHOW_CANDIDATES || r.type !== 'candidate_followup',
      ),
    [data],
  )

  const grouped = {
    high: reminders.filter((r) => r.priority === 'high'),
    medium: reminders.filter((r) => r.priority === 'medium'),
    low: reminders.filter((r) => r.priority === 'low'),
  }

  const handleAction = (reminder: (typeof reminders)[0]) => {
    if (reminder.type === 'company_followup') {
      markCompanyContacted(reminder.entityId)
      setView({ type: 'company-detail', id: reminder.entityId })
    } else if (reminder.type === 'candidate_followup') {
      markCandidateContacted(reminder.entityId)
      setView({ type: 'candidate-detail', id: reminder.entityId })
    } else if (reminder.type === 'linkedin_check') {
      markLinkedInChecked(reminder.entityId)
      if (reminder.actionUrl) window.open(reminder.actionUrl, '_blank')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reminders</h1>
        <p className="mt-1 text-slate-500">
          Follow-ups and LinkedIn job checks based on your outreach schedule
        </p>
      </div>

      {reminders.length === 0 ? (
        <div className="rounded-xl border border-pink-100 bg-white/90 py-16 text-center shadow-sm">
          <Bell className="mx-auto h-10 w-10 text-pink-400" />
          <p className="mt-4 font-medium text-slate-900">You're all caught up!</p>
          <p className="mt-1 text-sm text-slate-500">
            No pending follow-ups or LinkedIn checks right now.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {(['high', 'medium', 'low'] as const).map((priority) => {
            const items = grouped[priority]
            if (items.length === 0) return null
            return (
              <div key={priority}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {priority} priority ({items.length})
                </h2>
                <div className="space-y-3">
                  {items.map((r) => {
                    const Icon = typeIcons[r.type]
                    return (
                      <div
                        key={r.id}
                        className={`flex items-center gap-4 rounded-xl border border-slate-200 border-l-4 p-4 shadow-sm ${priorityStyles[r.priority]}`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                          <Icon className="h-5 w-5 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900">{r.title}</p>
                          <p className="text-sm text-slate-500">{r.description}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              if (SHOW_CANDIDATES && r.type === 'candidate_followup') {
                                setView({ type: 'candidate-detail', id: r.entityId })
                              } else {
                                setView({ type: 'company-detail', id: r.entityId })
                              }
                            }}
                          >
                            View
                          </Button>
                          <Button size="sm" onClick={() => handleAction(r)}>
                            {r.type === 'linkedin_check' ? 'Check Now' : 'Log Contact'}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-pink-200 bg-pink-50 p-5">
        <h3 className="font-medium text-pink-900">About LinkedIn Job Monitoring</h3>
        <p className="mt-2 text-sm text-pink-800">
          LinkedIn doesn't allow direct job scraping without their API. Add each company's
          LinkedIn Jobs page URL in their profile, and RecruitBD will remind you to check
          for new postings on your schedule. When you spot a new role, add it from the
          company profile.
        </p>
      </div>
    </div>
  )
}
