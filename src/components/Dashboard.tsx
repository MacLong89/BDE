import { format, parseISO } from 'date-fns'
import {
  ArrowRight,
  Building2,
  Briefcase,
  Send,
  UserCircle,
} from 'lucide-react'
import { useMemo } from 'react'
import { useApp } from '../store/AppContext'
import { computeReminders } from '../utils/reminders'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import {
  COMPANY_STATUS_COLORS,
  COMPANY_STATUS_LABELS,
  SUBMISSION_STATUS_COLORS,
  SUBMISSION_STATUS_LABELS,
} from '../constants/labels'

export function Dashboard() {
  const { data, setView, getCompany, getCandidate } = useApp()

  const reminders = useMemo(() => computeReminders(data).slice(0, 5), [data])

  const openRoles = data.roles.filter((r) => r.status === 'open')
  const activeSubmissions = data.submissions.filter(
    (s) => !['placed', 'rejected', 'withdrawn'].includes(s.status),
  )

  const stats = [
    {
      label: 'Companies',
      value: data.companies.length,
      icon: Building2,
      color: 'bg-pink-50 text-pink-600',
    },
    {
      label: 'Open Roles',
      value: openRoles.length,
      icon: Briefcase,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      label: 'Candidates',
      value: data.candidates.length,
      icon: UserCircle,
      color: 'bg-fuchsia-50 text-fuchsia-600',
    },
    {
      label: 'Active Submissions',
      value: activeSubmissions.length,
      icon: Send,
      color: 'bg-pink-100 text-pink-700',
    },
  ]

  const recentCompanies = [...data.companies]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">
          Your business development and placement overview
        </p>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-pink-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
              </div>
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-pink-100 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Action Required</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView({ type: 'reminders' })}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="divide-y divide-slate-50">
            {reminders.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                All caught up! No pending reminders.
              </p>
            ) : (
              reminders.map((r) => (
                <div key={r.id} className="flex items-start gap-3 px-5 py-4">
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      r.priority === 'high'
                        ? 'bg-red-500'
                        : r.priority === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-slate-300'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{r.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{r.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (r.type === 'candidate_followup') {
                        setView({ type: 'candidate-detail', id: r.entityId })
                      } else {
                        setView({ type: 'company-detail', id: r.entityId })
                      }
                    }}
                  >
                    Open
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-pink-100 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Recent Companies</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView({ type: 'companies' })}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentCompanies.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                No companies yet. Add your first prospect!
              </p>
            ) : (
              recentCompanies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setView({ type: 'company-detail', id: c.id })}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-pink-50/50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-400">
                      Updated {format(parseISO(c.updatedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge
                    label={COMPANY_STATUS_LABELS[c.status]}
                    colorClass={COMPANY_STATUS_COLORS[c.status]}
                  />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="col-span-2 rounded-xl border border-pink-100 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Active Pipeline</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                  <th className="px-5 py-3 font-medium">Candidate</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                      No active submissions
                    </td>
                  </tr>
                ) : (
                  activeSubmissions.slice(0, 8).map((s) => {
                    const candidate = getCandidate(s.candidateId)
                    const company = getCompany(s.companyId)
                    const role = data.roles.find((r) => r.id === s.roleId)
                    return (
                      <tr key={s.id} className="hover:bg-pink-50/50">
                        <td className="px-5 py-3 font-medium text-slate-900">
                          {candidate?.name ?? '—'}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {company?.name ?? '—'}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {role?.title ?? '—'}
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            label={SUBMISSION_STATUS_LABELS[s.status]}
                            colorClass={SUBMISSION_STATUS_COLORS[s.status]}
                          />
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {format(parseISO(s.submittedAt), 'MMM d')}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
