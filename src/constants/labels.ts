import type {
  CandidateStatus,
  CompanyStatus,
  RoleStatus,
  SubmissionStatus,
} from '../types'

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  prospect: 'Prospect',
  reached_out: 'Reached Out',
  in_conversation: 'In Conversation',
  meeting_scheduled: 'Meeting Scheduled',
  active_client: 'Active Client',
  on_hold: 'On Hold',
  not_interested: 'Not Interested',
}

export const COMPANY_STATUS_COLORS: Record<CompanyStatus, string> = {
  prospect: 'bg-slate-100 text-slate-700',
  reached_out: 'bg-pink-100 text-pink-700',
  in_conversation: 'bg-rose-100 text-rose-700',
  meeting_scheduled: 'bg-fuchsia-100 text-fuchsia-700',
  active_client: 'bg-pink-200 text-pink-800',
  on_hold: 'bg-amber-100 text-amber-700',
  not_interested: 'bg-red-100 text-red-700',
}

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  sourcing: 'Sourcing',
  reached_out: 'Reached Out',
  interested: 'Interested',
  passive: 'Passive',
  interviewing: 'Interviewing',
  placed: 'Placed',
  not_interested: 'Not Interested',
  unresponsive: 'Unresponsive',
}

export const CANDIDATE_STATUS_COLORS: Record<CandidateStatus, string> = {
  sourcing: 'bg-slate-100 text-slate-700',
  reached_out: 'bg-pink-100 text-pink-700',
  interested: 'bg-rose-100 text-rose-700',
  passive: 'bg-amber-100 text-amber-700',
  interviewing: 'bg-fuchsia-100 text-fuchsia-700',
  placed: 'bg-pink-200 text-pink-800',
  not_interested: 'bg-red-100 text-red-700',
  unresponsive: 'bg-orange-100 text-orange-700',
}

export const ROLE_STATUS_LABELS: Record<RoleStatus, string> = {
  open: 'Open',
  filled: 'Filled',
  on_hold: 'On Hold',
  closed: 'Closed',
}

export const ROLE_STATUS_COLORS: Record<RoleStatus, string> = {
  open: 'bg-pink-100 text-pink-700',
  filled: 'bg-rose-100 text-rose-700',
  on_hold: 'bg-amber-100 text-amber-700',
  closed: 'bg-slate-100 text-slate-600',
}

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  submitted: 'Submitted',
  screening: 'Screening',
  interview_1: 'Interview 1',
  interview_2: 'Interview 2',
  final_interview: 'Final Interview',
  offer: 'Offer',
  placed: 'Placed',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export const SUBMISSION_STATUS_COLORS: Record<SubmissionStatus, string> = {
  submitted: 'bg-pink-100 text-pink-700',
  screening: 'bg-rose-100 text-rose-700',
  interview_1: 'bg-fuchsia-100 text-fuchsia-700',
  interview_2: 'bg-fuchsia-100 text-fuchsia-800',
  final_interview: 'bg-purple-100 text-purple-700',
  offer: 'bg-amber-100 text-amber-700',
  placed: 'bg-pink-200 text-pink-800',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-slate-100 text-slate-600',
}
