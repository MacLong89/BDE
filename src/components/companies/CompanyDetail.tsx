import { format, parseISO } from 'date-fns'
import {
  ArrowLeft,
  Briefcase,
  Check,
  ExternalLink,
  MessageSquare,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import {
  COMPANY_STATUS_COLORS,
  COMPANY_STATUS_LABELS,
  ROLE_STATUS_COLORS,
  ROLE_STATUS_LABELS,
  SUBMISSION_STATUS_LABELS,
} from '../../constants/labels'
import { SHOW_CANDIDATES } from '../../constants/features'
import type { RoleStatus, SubmissionStatus } from '../../types'
import { useApp } from '../../store/AppContext'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { FieldGroup, Input, Label, Select, Textarea } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { CompanyForm } from './CompanyForm'

interface CompanyDetailProps {
  id: string
}

export function CompanyDetail({ id }: CompanyDetailProps) {
  const {
    data,
    setView,
    getCompany,
    getCandidate,
    addCompanyNote,
    deleteCompany,
    addRole,
    updateRole,
    deleteRole,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    markCompanyContacted,
    markLinkedInChecked,
  } = useApp()

  const company = getCompany(id)
  const [noteText, setNoteText] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [roleForm, setRoleForm] = useState({
    title: '',
    status: 'open' as RoleStatus,
    salary: '',
    location: '',
    linkedInUrl: '',
    notes: '',
    openedAt: new Date().toISOString().split('T')[0],
  })
  const [submissionForm, setSubmissionForm] = useState({
    roleId: '',
    candidateId: '',
    status: 'submitted' as SubmissionStatus,
    notes: '',
  })

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Company not found.</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => setView({ type: 'companies' })}
        >
          Back to Companies
        </Button>
      </div>
    )
  }

  const roles = data.roles.filter((r) => r.companyId === id)
  const submissions = data.submissions.filter((s) => s.companyId === id)
  const openRoles = roles.filter((r) => r.status === 'open')

  const handleAddNote = () => {
    if (!noteText.trim()) return
    addCompanyNote(id, noteText.trim())
    setNoteText('')
  }

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleForm.title.trim()) return
    addRole({
      companyId: id,
      title: roleForm.title,
      status: roleForm.status,
      salary: roleForm.salary || undefined,
      location: roleForm.location || undefined,
      linkedInUrl: roleForm.linkedInUrl || undefined,
      notes: roleForm.notes || undefined,
      openedAt: new Date(roleForm.openedAt).toISOString(),
    })
    setShowRoleForm(false)
    setRoleForm({
      title: '',
      status: 'open',
      salary: '',
      location: '',
      linkedInUrl: '',
      notes: '',
      openedAt: new Date().toISOString().split('T')[0],
    })
  }

  const handleAddSubmission = (e: React.FormEvent) => {
    e.preventDefault()
    if (!submissionForm.roleId || !submissionForm.candidateId) return
    addSubmission({
      companyId: id,
      roleId: submissionForm.roleId,
      candidateId: submissionForm.candidateId,
      status: submissionForm.status,
      submittedAt: new Date().toISOString(),
      notes: submissionForm.notes || undefined,
    })
    setShowSubmissionForm(false)
    setSubmissionForm({
      roleId: '',
      candidateId: '',
      status: 'submitted',
      notes: '',
    })
  }

  return (
    <div>
      <button
        onClick={() => setView({ type: 'companies' })}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Companies
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
            <Badge
              label={COMPANY_STATUS_LABELS[company.status]}
              colorClass={COMPANY_STATUS_COLORS[company.status]}
            />
          </div>
          {company.industry && (
            <p className="mt-1 text-slate-500">{company.industry}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => markCompanyContacted(id)}>
            <Check className="h-4 w-4" /> Log Contact
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('Delete this company and all related data?')) {
                deleteCompany(id)
                setView({ type: 'companies' })
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-pink-100 bg-white/90 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Contact</p>
          <p className="mt-1 font-medium text-slate-900">
            {company.contactName ?? 'Not set'}
          </p>
          {company.contactEmail && (
            <p className="text-sm text-slate-500">{company.contactEmail}</p>
          )}
          {company.contactPhone && (
            <p className="text-sm text-slate-500">{company.contactPhone}</p>
          )}
        </div>
        <div className="rounded-xl border border-pink-100 bg-white/90 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Last Contacted</p>
          <p className="mt-1 font-medium text-slate-900">
            {company.lastContactedAt
              ? format(parseISO(company.lastContactedAt), 'MMM d, yyyy')
              : 'Never'}
          </p>
          <p className="text-sm text-slate-500">
            Follow up every {company.followUpDays} days
          </p>
        </div>
        <div className="rounded-xl border border-pink-100 bg-white/90 p-4">
          <p className="text-xs font-medium uppercase text-slate-400">LinkedIn Jobs</p>
          {company.linkedInJobsUrl ? (
            <div className="mt-1 flex items-center gap-2">
              <a
                href={company.linkedInJobsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                View Jobs <ExternalLink className="h-3 w-3" />
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markLinkedInChecked(id)}
              >
                Mark Checked
              </Button>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-500">No LinkedIn jobs URL set</p>
          )}
          {company.lastLinkedInCheckAt && (
            <p className="text-xs text-slate-400">
              Last checked {format(parseISO(company.lastLinkedInCheckAt), 'MMM d')}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-pink-100 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <MessageSquare className="h-4 w-4" /> Notes
            </h2>
          </div>
          <div className="p-5">
            <div className="mb-4 flex gap-2">
              <Textarea
                className="min-h-[60px]"
                placeholder="Add a note about this company..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>
              Add Note
            </Button>
            <div className="mt-4 space-y-3">
              {company.notes.length === 0 ? (
                <p className="text-sm text-slate-400">No notes yet.</p>
              ) : (
                company.notes.map((note) => (
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
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <Briefcase className="h-4 w-4" /> Open Roles ({openRoles.length})
            </h2>
            <Button size="sm" onClick={() => setShowRoleForm(true)}>
              <Plus className="h-3 w-3" /> Add Role
            </Button>
          </div>
          <div className="divide-y divide-slate-50">
            {roles.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                No roles tracked yet.
              </p>
            ) : (
              roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{role.title}</p>
                    <p className="text-xs text-slate-400">
                      Opened {format(parseISO(role.openedAt), 'MMM d, yyyy')}
                      {role.location && ` · ${role.location}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="rounded border border-slate-200 px-2 py-1 text-xs"
                      value={role.status}
                      onChange={(e) =>
                        updateRole(role.id, { status: e.target.value as RoleStatus })
                      }
                    >
                      {Object.entries(ROLE_STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <Badge
                      label={ROLE_STATUS_LABELS[role.status]}
                      colorClass={ROLE_STATUS_COLORS[role.status]}
                    />
                    <button
                      onClick={() => {
                        if (confirm('Delete this role?')) deleteRole(role.id)
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {SHOW_CANDIDATES && (
      <div className="rounded-xl border border-pink-100 bg-white/90 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Candidate Submissions</h2>
          <Button size="sm" onClick={() => setShowSubmissionForm(true)}>
            <Plus className="h-3 w-3" /> Submit Candidate
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Candidate</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Submitted</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No candidates submitted to this company yet.
                  </td>
                </tr>
              ) : (
                submissions.map((s) => {
                  const candidate = getCandidate(s.candidateId)
                  const role = roles.find((r) => r.id === s.roleId)
                  return (
                    <tr key={s.id}>
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {candidate?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {role?.title ?? '—'}
                      </td>
                      <td className="px-5 py-3">
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
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {format(parseISO(s.submittedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => {
                            if (confirm('Remove this submission?')) deleteSubmission(s.id)
                          }}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      <Modal title="Edit Company" open={showEdit} onClose={() => setShowEdit(false)} wide>
        <CompanyForm
          company={company}
          onSave={() => setShowEdit(false)}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>

      <Modal title="Add Role" open={showRoleForm} onClose={() => setShowRoleForm(false)}>
        <form onSubmit={handleAddRole}>
          <FieldGroup>
            <Label>Role Title *</Label>
            <Input
              value={roleForm.title}
              onChange={(e) => setRoleForm({ ...roleForm, title: e.target.value })}
              placeholder="Senior Software Engineer"
              required
            />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <Label>Status</Label>
              <Select
                value={roleForm.status}
                onChange={(e) =>
                  setRoleForm({ ...roleForm, status: e.target.value as RoleStatus })
                }
              >
                {Object.entries(ROLE_STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label>Opened Date</Label>
              <Input
                type="date"
                value={roleForm.openedAt}
                onChange={(e) => setRoleForm({ ...roleForm, openedAt: e.target.value })}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Location</Label>
              <Input
                value={roleForm.location}
                onChange={(e) => setRoleForm({ ...roleForm, location: e.target.value })}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Salary</Label>
              <Input
                value={roleForm.salary}
                onChange={(e) => setRoleForm({ ...roleForm, salary: e.target.value })}
              />
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label>LinkedIn Job URL</Label>
            <Input
              value={roleForm.linkedInUrl}
              onChange={(e) => setRoleForm({ ...roleForm, linkedInUrl: e.target.value })}
              placeholder="https://linkedin.com/jobs/..."
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Notes</Label>
            <Textarea
              value={roleForm.notes}
              onChange={(e) => setRoleForm({ ...roleForm, notes: e.target.value })}
            />
          </FieldGroup>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowRoleForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Role</Button>
          </div>
        </form>
      </Modal>

      {SHOW_CANDIDATES && (
      <Modal
        title="Submit Candidate"
        open={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
      >
        <form onSubmit={handleAddSubmission}>
          <FieldGroup>
            <Label>Role *</Label>
            <Select
              value={submissionForm.roleId}
              onChange={(e) =>
                setSubmissionForm({ ...submissionForm, roleId: e.target.value })
              }
              required
            >
              <option value="">Select a role...</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup>
            <Label>Candidate *</Label>
            <Select
              value={submissionForm.candidateId}
              onChange={(e) =>
                setSubmissionForm({ ...submissionForm, candidateId: e.target.value })
              }
              required
            >
              <option value="">Select a candidate...</option>
              {data.candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup>
            <Label>Status</Label>
            <Select
              value={submissionForm.status}
              onChange={(e) =>
                setSubmissionForm({
                  ...submissionForm,
                  status: e.target.value as SubmissionStatus,
                })
              }
            >
              {Object.entries(SUBMISSION_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup>
            <Label>Notes</Label>
            <Textarea
              value={submissionForm.notes}
              onChange={(e) =>
                setSubmissionForm({ ...submissionForm, notes: e.target.value })
              }
            />
          </FieldGroup>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowSubmissionForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>
      )}
    </div>
  )
}
