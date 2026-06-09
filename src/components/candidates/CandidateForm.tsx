import { useState } from 'react'
import type { Candidate, CandidateStatus } from '../../types'
import { CANDIDATE_STATUS_LABELS } from '../../constants/labels'
import { useApp } from '../../store/AppContext'
import { Button } from '../ui/Button'
import { FieldGroup, Input, Label, Select } from '../ui/Input'

interface CandidateFormProps {
  candidate?: Candidate
  onSave: (id: string) => void
  onCancel: () => void
}

export function CandidateForm({ candidate, onSave, onCancel }: CandidateFormProps) {
  const { addCandidate, updateCandidate, data } = useApp()
  const [form, setForm] = useState({
    name: candidate?.name ?? '',
    email: candidate?.email ?? '',
    phone: candidate?.phone ?? '',
    linkedInUrl: candidate?.linkedInUrl ?? '',
    currentTitle: candidate?.currentTitle ?? '',
    skills: candidate?.skills ?? '',
    status: (candidate?.status ?? 'sourcing') as CandidateStatus,
    followUpDays: candidate?.followUpDays ?? data.settings.defaultFollowUpDays,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    if (candidate) {
      updateCandidate(candidate.id, form)
      onSave(candidate.id)
    } else {
      const id = addCandidate(form)
      onSave(id)
    }
  }

  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <Label>Full Name *</Label>
          <Input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="John Doe"
            required
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Status</Label>
          <Select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            {Object.entries(CANDIDATE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Current Title</Label>
          <Input
            value={form.currentTitle}
            onChange={(e) => set('currentTitle', e.target.value)}
            placeholder="Senior Developer"
          />
        </FieldGroup>
        <FieldGroup>
          <Label>LinkedIn Profile</Label>
          <Input
            value={form.linkedInUrl}
            onChange={(e) => set('linkedInUrl', e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Skills</Label>
          <Input
            value={form.skills}
            onChange={(e) => set('skills', e.target.value)}
            placeholder="React, TypeScript, Node.js"
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Follow-up Every (days)</Label>
          <Input
            type="number"
            min={1}
            value={form.followUpDays}
            onChange={(e) => set('followUpDays', Number(e.target.value))}
          />
        </FieldGroup>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {candidate ? 'Save Changes' : 'Add Candidate'}
        </Button>
      </div>
    </form>
  )
}
