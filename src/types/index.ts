export type CompanyStatus =
  | 'prospect'
  | 'reached_out'
  | 'in_conversation'
  | 'meeting_scheduled'
  | 'active_client'
  | 'on_hold'
  | 'not_interested'

export type RoleStatus = 'open' | 'filled' | 'on_hold' | 'closed'

export type SubmissionStatus =
  | 'submitted'
  | 'screening'
  | 'interview_1'
  | 'interview_2'
  | 'final_interview'
  | 'offer'
  | 'placed'
  | 'rejected'
  | 'withdrawn'

export type CandidateStatus =
  | 'sourcing'
  | 'reached_out'
  | 'interested'
  | 'passive'
  | 'interviewing'
  | 'placed'
  | 'not_interested'
  | 'unresponsive'

export interface Note {
  id: string
  content: string
  createdAt: string
}

export interface Company {
  id: string
  name: string
  industry?: string
  website?: string
  linkedInUrl?: string
  linkedInJobsUrl?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  status: CompanyStatus
  notes: Note[]
  lastContactedAt?: string
  lastLinkedInCheckAt?: string
  followUpDays: number
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  companyId: string
  title: string
  status: RoleStatus
  salary?: string
  location?: string
  linkedInUrl?: string
  notes?: string
  openedAt: string
  createdAt: string
}

export interface Candidate {
  id: string
  name: string
  email?: string
  phone?: string
  linkedInUrl?: string
  currentTitle?: string
  skills?: string
  status: CandidateStatus
  notes: Note[]
  lastContactedAt?: string
  followUpDays: number
  createdAt: string
  updatedAt: string
}

export interface Submission {
  id: string
  companyId: string
  roleId: string
  candidateId: string
  status: SubmissionStatus
  submittedAt: string
  notes?: string
  updatedAt: string
}

export interface AppSettings {
  defaultFollowUpDays: number
  linkedInCheckDays: number
  notificationsEnabled: boolean
}

export type TodoStatus = 'on_deck' | 'in_progress' | 'done'

export interface TodoItem {
  id: string
  title: string
  status: TodoStatus
  order: number
  createdAt: string
  completedAt?: string
  /** When true, show focus timer controls on this task */
  isTimed?: boolean
  /** Optional focus timer length in minutes */
  durationMinutes?: number
  /** ISO timestamp when the timer was started */
  timerStartedAt?: string
  /** ISO timestamp when the timer finished (shows alert until dismissed) */
  timerEndedAt?: string
}

export interface AppData {
  companies: Company[]
  roles: Role[]
  candidates: Candidate[]
  submissions: Submission[]
  todos: TodoItem[]
  settings: AppSettings
}

export type View =
  | { type: 'dashboard' }
  | { type: 'companies' }
  | { type: 'company-detail'; id: string }
  | { type: 'candidates' }
  | { type: 'candidate-detail'; id: string }
  | { type: 'todo' }
  | { type: 'reminders' }
  | { type: 'settings' }
