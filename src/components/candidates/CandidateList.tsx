import { format, parseISO } from 'date-fns'
import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  CANDIDATE_STATUS_COLORS,
  CANDIDATE_STATUS_LABELS,
} from '../../constants/labels'
import { useApp } from '../../store/AppContext'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { CandidateForm } from './CandidateForm'

export function CandidateList() {
  const { data, setView } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => {
    return data.candidates
      .filter((c) => {
        const matchesSearch =
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.currentTitle?.toLowerCase().includes(search.toLowerCase()) ||
          c.skills?.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }, [data.candidates, search, statusFilter])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
          <p className="mt-1 text-slate-500">
            Track placements, outreach, and candidate pipeline
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" /> Add Candidate
        </Button>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {Object.entries(CANDIDATE_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-pink-100 bg-white/90 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pink-100 bg-pink-50/60 text-left text-xs text-slate-500">
              <th className="px-5 py-3 font-medium">Candidate</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Current Title</th>
              <th className="px-5 py-3 font-medium">Submissions</th>
              <th className="px-5 py-3 font-medium">Last Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                  {data.candidates.length === 0
                    ? 'No candidates yet. Click "Add Candidate" to get started.'
                    : 'No candidates match your search.'}
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const submissionCount = data.submissions.filter(
                  (s) => s.candidateId === c.id,
                ).length
                return (
                  <tr
                    key={c.id}
                    className="cursor-pointer hover:bg-pink-50/50"
                    onClick={() => setView({ type: 'candidate-detail', id: c.id })}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{c.name}</p>
                      {c.email && (
                        <p className="text-xs text-slate-400">{c.email}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        label={CANDIDATE_STATUS_LABELS[c.status]}
                        colorClass={CANDIDATE_STATUS_COLORS[c.status]}
                      />
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {c.currentTitle ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{submissionCount}</td>
                    <td className="px-5 py-4 text-slate-500">
                      {c.lastContactedAt
                        ? format(parseISO(c.lastContactedAt), 'MMM d, yyyy')
                        : 'Never'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Add Candidate"
        open={showForm}
        onClose={() => setShowForm(false)}
        wide
      >
        <CandidateForm
          onSave={(id) => {
            setShowForm(false)
            setView({ type: 'candidate-detail', id })
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}
