import type { MouseEvent } from 'react'
import {
  COMPANY_STATUS_COLORS,
  COMPANY_STATUS_LABELS,
} from '../../constants/labels'
import type { CompanyStatus } from '../../types'
import { useApp } from '../../store/AppContext'

interface CompanyStatusSelectProps {
  companyId: string
  status: CompanyStatus
  size?: 'sm' | 'md'
  onPointerDown?: (e: MouseEvent) => void
}

export function CompanyStatusSelect({
  companyId,
  status,
  size = 'sm',
  onPointerDown,
}: CompanyStatusSelectProps) {
  const { updateCompany } = useApp()

  const sizeClass =
    size === 'md'
      ? 'px-3 py-1 text-sm'
      : 'px-2.5 py-0.5 text-xs'

  return (
    <select
      value={status}
      onChange={(e) =>
        updateCompany(companyId, { status: e.target.value as CompanyStatus })
      }
      onClick={(e) => e.stopPropagation()}
      onPointerDown={onPointerDown}
      className={`inline-flex cursor-pointer appearance-none rounded-full border-0 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500/30 ${sizeClass} ${COMPANY_STATUS_COLORS[status]}`}
      aria-label="Change company status"
    >
      {Object.entries(COMPANY_STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
}
