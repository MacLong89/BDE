import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { v4 as uuid } from 'uuid'
import type {
  AppData,
  Candidate,
  Company,
  Note,
  Role,
  Submission,
  View,
} from '../types'
import { loadAppData, saveAppData } from '../utils/storage'

interface AppContextValue {
  data: AppData
  view: View
  setView: (view: View) => void
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => string
  updateCompany: (id: string, updates: Partial<Company>) => void
  deleteCompany: (id: string) => void
  addCompanyNote: (companyId: string, content: string) => void
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => string
  updateRole: (id: string, updates: Partial<Role>) => void
  deleteRole: (id: string) => void
  addCandidate: (
    candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt' | 'notes'>,
  ) => string
  updateCandidate: (id: string, updates: Partial<Candidate>) => void
  deleteCandidate: (id: string) => void
  addCandidateNote: (candidateId: string, content: string) => void
  addSubmission: (submission: Omit<Submission, 'id' | 'updatedAt'>) => string
  updateSubmission: (id: string, updates: Partial<Submission>) => void
  deleteSubmission: (id: string) => void
  updateSettings: (updates: Partial<AppData['settings']>) => void
  markCompanyContacted: (id: string) => void
  markCandidateContacted: (id: string) => void
  markLinkedInChecked: (companyId: string) => void
  getCompany: (id: string) => Company | undefined
  getCandidate: (id: string) => Candidate | undefined
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadAppData)
  const [view, setView] = useState<View>({ type: 'dashboard' })

  useEffect(() => {
    saveAppData(data)
  }, [data])

  const now = () => new Date().toISOString()

  const addCompany = useCallback(
    (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => {
      const id = uuid()
      const ts = now()
      setData((prev) => ({
        ...prev,
        companies: [
          ...prev.companies,
          { ...company, id, notes: [], createdAt: ts, updatedAt: ts },
        ],
      }))
      return id
    },
    [],
  )

  const updateCompany = useCallback((id: string, updates: Partial<Company>) => {
    setData((prev) => ({
      ...prev,
      companies: prev.companies.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: now() } : c,
      ),
    }))
  }, [])

  const deleteCompany = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      companies: prev.companies.filter((c) => c.id !== id),
      roles: prev.roles.filter((r) => r.companyId !== id),
      submissions: prev.submissions.filter((s) => s.companyId !== id),
    }))
  }, [])

  const addCompanyNote = useCallback((companyId: string, content: string) => {
    const note: Note = { id: uuid(), content, createdAt: now() }
    setData((prev) => ({
      ...prev,
      companies: prev.companies.map((c) =>
        c.id === companyId
          ? { ...c, notes: [note, ...c.notes], updatedAt: now() }
          : c,
      ),
    }))
  }, [])

  const addRole = useCallback((role: Omit<Role, 'id' | 'createdAt'>) => {
    const id = uuid()
    setData((prev) => ({
      ...prev,
      roles: [...prev.roles, { ...role, id, createdAt: now() }],
    }))
    return id
  }, [])

  const updateRole = useCallback((id: string, updates: Partial<Role>) => {
    setData((prev) => ({
      ...prev,
      roles: prev.roles.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }))
  }, [])

  const deleteRole = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      roles: prev.roles.filter((r) => r.id !== id),
      submissions: prev.submissions.filter((s) => s.roleId !== id),
    }))
  }, [])

  const addCandidate = useCallback(
    (
      candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt' | 'notes'>,
    ) => {
      const id = uuid()
      const ts = now()
      setData((prev) => ({
        ...prev,
        candidates: [
          ...prev.candidates,
          { ...candidate, id, notes: [], createdAt: ts, updatedAt: ts },
        ],
      }))
      return id
    },
    [],
  )

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    setData((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: now() } : c,
      ),
    }))
  }, [])

  const deleteCandidate = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((c) => c.id !== id),
      submissions: prev.submissions.filter((s) => s.candidateId !== id),
    }))
  }, [])

  const addCandidateNote = useCallback((candidateId: string, content: string) => {
    const note: Note = { id: uuid(), content, createdAt: now() }
    setData((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) =>
        c.id === candidateId
          ? { ...c, notes: [note, ...c.notes], updatedAt: now() }
          : c,
      ),
    }))
  }, [])

  const addSubmission = useCallback(
    (submission: Omit<Submission, 'id' | 'updatedAt'>) => {
      const id = uuid()
      setData((prev) => ({
        ...prev,
        submissions: [
          ...prev.submissions,
          { ...submission, id, updatedAt: now() },
        ],
      }))
      return id
    },
    [],
  )

  const updateSubmission = useCallback((id: string, updates: Partial<Submission>) => {
    setData((prev) => ({
      ...prev,
      submissions: prev.submissions.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: now() } : s,
      ),
    }))
  }, [])

  const deleteSubmission = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      submissions: prev.submissions.filter((s) => s.id !== id),
    }))
  }, [])

  const updateSettings = useCallback((updates: Partial<AppData['settings']>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }))
  }, [])

  const markCompanyContacted = useCallback((id: string) => {
    updateCompany(id, { lastContactedAt: now() })
  }, [updateCompany])

  const markCandidateContacted = useCallback((id: string) => {
    updateCandidate(id, { lastContactedAt: now() })
  }, [updateCandidate])

  const markLinkedInChecked = useCallback((companyId: string) => {
    updateCompany(companyId, { lastLinkedInCheckAt: now() })
  }, [updateCompany])

  const getCompany = useCallback(
    (id: string) => data.companies.find((c) => c.id === id),
    [data.companies],
  )

  const getCandidate = useCallback(
    (id: string) => data.candidates.find((c) => c.id === id),
    [data.candidates],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      view,
      setView,
      addCompany,
      updateCompany,
      deleteCompany,
      addCompanyNote,
      addRole,
      updateRole,
      deleteRole,
      addCandidate,
      updateCandidate,
      deleteCandidate,
      addCandidateNote,
      addSubmission,
      updateSubmission,
      deleteSubmission,
      updateSettings,
      markCompanyContacted,
      markCandidateContacted,
      markLinkedInChecked,
      getCompany,
      getCandidate,
    }),
    [
      data,
      view,
      addCompany,
      updateCompany,
      deleteCompany,
      addCompanyNote,
      addRole,
      updateRole,
      deleteRole,
      addCandidate,
      updateCandidate,
      deleteCandidate,
      addCandidateNote,
      addSubmission,
      updateSubmission,
      deleteSubmission,
      updateSettings,
      markCompanyContacted,
      markCandidateContacted,
      markLinkedInChecked,
      getCompany,
      getCandidate,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
