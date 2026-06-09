import { useState } from 'react'
import type { Company, CompanyStatus } from '../../types'
import { COMPANY_STATUS_LABELS } from '../../constants/labels'
import { useApp } from '../../store/AppContext'
import { Button } from '../ui/Button'
import { FieldGroup, Input, Label, Select } from '../ui/Input'

interface CompanyFormProps {
  company?: Company
  onSave: (id: string) => void
  onCancel: () => void
}

export function CompanyForm({ company, onSave, onCancel }: CompanyFormProps) {
  const { addCompany, updateCompany, data } = useApp()
  const [form, setForm] = useState({
    name: company?.name ?? '',
    industry: company?.industry ?? '',
    website: company?.website ?? '',
    linkedInUrl: company?.linkedInUrl ?? '',
    linkedInJobsUrl: company?.linkedInJobsUrl ?? '',
    contactName: company?.contactName ?? '',
    contactEmail: company?.contactEmail ?? '',
    contactPhone: company?.contactPhone ?? '',
    status: (company?.status ?? 'prospect') as CompanyStatus,
    followUpDays: company?.followUpDays ?? data.settings.defaultFollowUpDays,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    if (company) {
      updateCompany(company.id, form)
      onSave(company.id)
    } else {
      const id = addCompany(form)
      onSave(id)
    }
  }

  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <Label>Company Name *</Label>
          <Input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Acme Corp"
            required
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Industry</Label>
          <Input
            value={form.industry}
            onChange={(e) => set('industry', e.target.value)}
            placeholder="Technology"
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Status</Label>
          <Select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            {Object.entries(COMPANY_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
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
        <FieldGroup>
          <Label>Website</Label>
          <Input
            value={form.website}
            onChange={(e) => set('website', e.target.value)}
            placeholder="https://..."
          />
        </FieldGroup>
        <FieldGroup>
          <Label>LinkedIn Company Page</Label>
          <Input
            value={form.linkedInUrl}
            onChange={(e) => set('linkedInUrl', e.target.value)}
            placeholder="https://linkedin.com/company/..."
          />
        </FieldGroup>
        <FieldGroup>
          <Label>LinkedIn Jobs Page</Label>
          <Input
            value={form.linkedInJobsUrl}
            onChange={(e) => set('linkedInJobsUrl', e.target.value)}
            placeholder="https://linkedin.com/company/.../jobs"
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Contact Name</Label>
          <Input
            value={form.contactName}
            onChange={(e) => set('contactName', e.target.value)}
            placeholder="Jane Smith"
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Contact Email</Label>
          <Input
            type="email"
            value={form.contactEmail}
            onChange={(e) => set('contactEmail', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Contact Phone</Label>
          <Input
            value={form.contactPhone}
            onChange={(e) => set('contactPhone', e.target.value)}
          />
        </FieldGroup>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{company ? 'Save Changes' : 'Add Company'}</Button>
      </div>
    </form>
  )
}
