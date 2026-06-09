import { format, parseISO } from 'date-fns'
import {
  ArrowLeft,
  Check,
  ExternalLink,
  MessageSquare,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import {
  CANDIDATE_STATUS_COLORS,
  CANDIDATE_STATUS_LABELS,
  SUBMISSION_STATUS_COLORS,
  SUBMISSION_STATUS_LABELS,
} from '../../constants/labels'
import type { SubmissionStatus } from '../../types'
import { useApp } from '../../store/AppContext'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { CandidateForm } from './CandidateForm'

interface CandidateDetailProps {
  id: string
}

export function CandidateDetail({ id }: CandidateDetailProps) {
  const {
    data,
    setView,
    getCandidate,
    getCompany,
    addCandidateNote,
    deleteCandidate,
    updateSubmission,
    markCandidateContacted,
  } = useApp()

  const candidate = getCandidate(id)
  const [noteText, setNoteText] = useState('')
  const [showEdit, setShowEdit] = useState(false)

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Candidate not found.</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => setView({ type: 'candidates' })}
        >
          Back to Candidates
        </Button>
      </div>
    )
  }

  const submissions = data.submissions.filter((s) => s.candidateId === id)

  const handleAddNote = () => {
    if (!noteText.trim()) return
    addCandidateNote(id, noteText.trim())
    setNoteText('')
  }

  return (
    <div>
      <button
        onClick={() => setView({ type: 'candidates' })}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Candidates
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{candidate.name}</h1>
            <Badge
              label={CANDIDATE_STATUS_LABELS[candidate.status]}
              colorClass={CANDIDATE_STATUS_COLORS[candidate.status]}
            />
          </div>
          {candidate.currentTitle && (
            <p className="mt-1 text-slate-500">{candidate.currentTitle}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => markCandidateContacted(id)}
          >
            <Check className="h-4 w-4" /> Log Contact
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('Delete this candidate and all related submissions?')) {
                deleteCandidate(id)
                setView({ type: 'candidates' })
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-pink-100 bg-white/90 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Contact Info</p>
          {candidate.email && (
            <p className="mt-1 text-sm text-slate-700">{candidate.email}</p>
          )}
          {candidate.phone && (
            <p className="text-sm text-slate-700">{candidate.phone}</p>
          )}
          {candidate.linkedInUrl && (
            <a
              href={candidate.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700"
            >
              LinkedIn <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="rounded-xl border border-pink-100 bg-white/90 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Last Contacted</p>
          <p className="mt-1 font-medium text-slate-900">
            {candidate.lastContactedAt
              ? format(parseISO(candidate.lastContactedAt), 'MMM d, yyyy')
              : 'Never'}
          </p>
          <p className="text-sm text-slate-500">
            Follow up every {candidate.followUpDays} days
          </p>
        </div>
        <div className="rounded-xl border border-pink-100 bg-white/90 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Skills</p>
          <p className="mt-1 text-sm text-slate-700">
            {candidate.skills ?? 'Not specified'}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-pink-100 bg-white/90 shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <MessageSquare className="h-4 w-4" /> Notes
            </h2>
          </div>
          <div className="p-5">
            <Textarea
              className="mb-3 min-h-[60px]"
              placeholder="Add a note about this candidate..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>
              Add Note
            </Button>
            <div className="mt-4 space-y-3">
              {candidate.notes.length === 0 ? (
                <p className="text-sm text-slate-400">No notes yet.</p>
              ) : (
                candidate.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg bg-pink-50 px-4 py-3 text-sm"
                  >
                    <p className="text-slate-700">{note.content}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {format(parseISO(note.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-pink-100 bg-white/90 shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Submissions ({submissions.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {submissions.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                Not submitted to any companies yet. Submit from a company profile.
              </p>
            ) : (
              submissions.map((s) => {
                const company = getCompany(s.companyId)
                const role = data.roles.find((r) => r.id === s.roleId)
                return (
                  <div key={s.id} className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {company?.name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {role?.title ?? 'Unknown role'} · Submitted{' '}
                          {format(parseISO(s.submittedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <select
                        className="rounded border border-slate-200 px-2 py-1 text-xs"
                        value={s.status}
                        onChange={(e) =>
                          updateSubmission(s.id, {
                            status: e.target.value as SubmissionStatus,
                          })
                        }
                      >
                        {Object.entries(SUBMISSION_STATUS_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-2">
                      <Badge
                        label={SUBMISSION_STATUS_LABELS[s.status]}
                        colorClass={SUBMISSION_STATUS_COLORS[s.status]}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <Modal
        title="Edit Candidate"
        open={showEdit}
        onClose={() => setShowEdit(false)}
        wide
      >
        <CandidateForm
          candidate={candidate}
          onSave={() => setShowEdit(false)}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>
    </div>
  )
}
