import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  TodoItem,
  TodoStatus,
  View,
} from '../types'
import { loadDataForUser, saveUserData } from '../utils/cloudStorage'
import { defaultAppData } from '../utils/storage'
import { applyColumnOrder, moveTodoInList, nextOrder, todosForColumn } from '../utils/todos'
import { useAuth } from './AuthContext'

interface AppContextValue {
  data: AppData
  dataLoading: boolean
  syncStatus: 'idle' | 'saving' | 'saved' | 'error'
  view: View
  setView: (view: View) => void
  replaceData: (data: AppData) => void
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
  addTodo: (title: string) => string
  updateTodo: (
    id: string,
    updates: Partial<
      Pick<
        TodoItem,
        'title' | 'isTimed' | 'durationMinutes' | 'timerStartedAt' | 'timerEndedAt'
      >
    >,
  ) => void
  deleteTodo: (id: string) => void
  moveTodo: (id: string, toStatus: TodoStatus, toIndex: number) => void
  completeTodo: (id: string) => void
  uncompleteTodo: (id: string) => void
  startTodoTimer: (id: string) => void
  stopTodoTimer: (id: string) => void
  completeTodoTimer: (id: string) => void
  dismissTodoTimerAlert: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setData] = useState<AppData>(defaultAppData())
  const [dataLoading, setDataLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [view, setView] = useState<View>({ type: 'dashboard' })
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!user) {
      setData(defaultAppData())
      setDataLoading(false)
      setSyncStatus('idle')
      return
    }

    let cancelled = false
    setDataLoading(true)

    loadDataForUser(user.id)
      .then((loaded) => {
        if (!cancelled) setData(loaded)
      })
      .catch(() => {
        if (!cancelled) setSyncStatus('error')
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user?.id])

  useEffect(() => {
    if (!user || dataLoading) return

    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    setSyncStatus('saving')

    saveTimer.current = window.setTimeout(() => {
      saveUserData(user.id, data)
        .then(() => setSyncStatus('saved'))
        .catch(() => setSyncStatus('error'))
    }, 800)

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [data, user?.id, dataLoading])

  const replaceData = useCallback((next: AppData) => {
    setData(next)
  }, [])

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

  const addTodo = useCallback((title: string) => {
    const id = uuid()
    const ts = now()
    setData((prev) => ({
      ...prev,
      todos: [
        ...prev.todos,
        {
          id,
          title: title.trim(),
          status: 'on_deck',
          order: nextOrder(prev.todos, 'on_deck'),
          createdAt: ts,
        },
      ],
    }))
    return id
  }, [])

  const updateTodo = useCallback(
    (
      id: string,
      updates: Partial<
        Pick<
          TodoItem,
          'title' | 'isTimed' | 'durationMinutes' | 'timerStartedAt' | 'timerEndedAt'
        >
      >,
    ) => {
      setData((prev) => ({
        ...prev,
        todos: prev.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }))
    },
    [],
  )

  const deleteTodo = useCallback((id: string) => {
    setData((prev) => {
      const item = prev.todos.find((t) => t.id === id)
      if (!item) return prev
      const remaining = prev.todos.filter((t) => t.id !== id)
      const columnIds = todosForColumn(remaining, item.status).map((t) => t.id)
      return {
        ...prev,
        todos: applyColumnOrder(remaining, item.status, columnIds, now()),
      }
    })
  }, [])

  const moveTodo = useCallback((id: string, toStatus: TodoStatus, toIndex: number) => {
    setData((prev) => ({
      ...prev,
      todos: moveTodoInList(prev.todos, id, toStatus, toIndex, now()),
    }))
  }, [])

  const completeTodo = useCallback((id: string) => {
    setData((prev) => {
      const item = prev.todos.find((t) => t.id === id)
      if (!item || item.status === 'done') return prev
      const ts = now()
      const moved = moveTodoInList(prev.todos, id, 'done', 0, ts)
      return {
        ...prev,
        todos: moved.map((t) =>
          t.id === id
            ? {
                ...t,
                timerStartedAt: undefined,
                timerEndedAt: undefined,
              }
            : t,
        ),
      }
    })
  }, [])

  const uncompleteTodo = useCallback((id: string) => {
    setData((prev) => {
      const item = prev.todos.find((t) => t.id === id)
      if (!item || item.status !== 'done') return prev
      return {
        ...prev,
        todos: moveTodoInList(prev.todos, id, 'on_deck', 0, now()),
      }
    })
  }, [])

  const startTodoTimer = useCallback((id: string) => {
    setData((prev) => {
      const item = prev.todos.find((t) => t.id === id)
      if (!item?.isTimed || !item.durationMinutes || item.durationMinutes <= 0) return prev
      const ts = now()
      const withTimer = prev.todos.map((t) =>
        t.id === id
          ? { ...t, timerStartedAt: ts, timerEndedAt: undefined }
          : t,
      )
      if (item.status === 'on_deck') {
        return {
          ...prev,
          todos: moveTodoInList(withTimer, id, 'in_progress', 0, ts),
        }
      }
      return { ...prev, todos: withTimer }
    })
  }, [])

  const stopTodoTimer = useCallback((id: string) => {
    updateTodo(id, { timerStartedAt: undefined })
  }, [updateTodo])

  const completeTodoTimer = useCallback((id: string) => {
    updateTodo(id, { timerStartedAt: undefined, timerEndedAt: now() })
  }, [updateTodo])

  const dismissTodoTimerAlert = useCallback((id: string) => {
    updateTodo(id, { timerStartedAt: undefined, timerEndedAt: undefined })
  }, [updateTodo])

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      dataLoading,
      syncStatus,
      view,
      setView,
      replaceData,
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
      addTodo,
      updateTodo,
      deleteTodo,
      moveTodo,
      completeTodo,
      uncompleteTodo,
      startTodoTimer,
      stopTodoTimer,
      completeTodoTimer,
      dismissTodoTimerAlert,
    }),
    [
      data,
      dataLoading,
      syncStatus,
      view,
      replaceData,
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
      addTodo,
      updateTodo,
      deleteTodo,
      moveTodo,
      completeTodo,
      uncompleteTodo,
      startTodoTimer,
      stopTodoTimer,
      completeTodoTimer,
      dismissTodoTimerAlert,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
