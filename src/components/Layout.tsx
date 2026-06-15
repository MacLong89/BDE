import {
  Bell,
  Building2,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
} from 'lucide-react'
import { useMemo } from 'react'
import { SHOW_CANDIDATES } from '../constants/features'
import { useAuth } from '../store/AuthContext'
import { useApp } from '../store/AppContext'
import { computeReminders } from '../utils/reminders'

const allNavItems = [
  { type: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { type: 'companies' as const, label: 'Companies', icon: Building2 },
  { type: 'todo' as const, label: 'ToDo', icon: CheckSquare },
  { type: 'candidates' as const, label: 'Candidates', icon: UserCircle },
  { type: 'reminders' as const, label: 'Reminders', icon: Bell },
  { type: 'settings' as const, label: 'Settings', icon: Settings },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { view, setView, data, syncStatus } = useApp()
  const { user, signOut } = useAuth()
  const navItems = useMemo(
    () =>
      allNavItems.filter(
        (item) => SHOW_CANDIDATES || item.type !== 'candidates',
      ),
    [],
  )
  const reminderCount = useMemo(
    () =>
      computeReminders(data).filter(
        (r) => SHOW_CANDIDATES || r.type !== 'candidate_followup',
      ).length,
    [data],
  )

  const isActive = (type: string) => {
    if (view.type === type) return true
    if (type === 'companies' && view.type === 'company-detail') return true
    if (SHOW_CANDIDATES && type === 'candidates' && view.type === 'candidate-detail')
      return true
    return false
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-pink-100 bg-white/90 backdrop-blur-sm">
        <div className="border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-sm font-bold text-white shadow-md shadow-pink-200">
              R
            </div>
            <div>
              <p className="font-semibold text-slate-900">RecruitBD</p>
              <p className="text-xs text-slate-500">BD & Placement Tracker</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setView({ type })}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(type)
                  ? 'bg-pink-50 text-pink-700'
                  : 'text-slate-600 hover:bg-pink-50/60 hover:text-pink-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {type === 'reminders' && reminderCount > 0 && (
                <span className="ml-auto rounded-full bg-pink-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {reminderCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-pink-100 px-6 py-4">
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <p className="mt-1 text-xs text-slate-400">
            {data.companies.length} companies
            {SHOW_CANDIDATES && ` · ${data.candidates.length} candidates`}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {syncStatus === 'saving' && 'Saving...'}
            {syncStatus === 'saved' && 'All changes saved'}
            {syncStatus === 'error' && 'Sync error — retrying on next change'}
            {syncStatus === 'idle' && 'Ready'}
          </p>
          <button
            type="button"
            onClick={() => signOut()}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-pink-700"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <div
          className={`mx-auto px-8 py-8 ${view.type === 'todo' ? 'max-w-7xl' : 'max-w-6xl'}`}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
