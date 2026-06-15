import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { CompanyList } from './components/companies/CompanyList'
import { CompanyDetail } from './components/companies/CompanyDetail'
import { CandidateList } from './components/candidates/CandidateList'
import { CandidateDetail } from './components/candidates/CandidateDetail'
import { Reminders } from './components/Reminders'
import { Settings } from './components/Settings'
import { TodoBoard } from './components/TodoBoard'
import { LoginPage } from './components/auth/LoginPage'
import { SHOW_CANDIDATES } from './constants/features'
import { useNotifications } from './hooks/useNotifications'
import { useAuth } from './store/AuthContext'
import { useApp } from './store/AppContext'

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-pink-200 border-t-pink-600" />
        <p className="mt-4 text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

function AppContent() {
  const { view, dataLoading } = useApp()
  useNotifications()

  if (dataLoading) {
    return <LoadingScreen label="Loading your data..." />
  }

  const renderView = () => {
    switch (view.type) {
      case 'dashboard':
        return <Dashboard />
      case 'companies':
        return <CompanyList />
      case 'company-detail':
        return <CompanyDetail id={view.id} />
      case 'candidates':
        return SHOW_CANDIDATES ? <CandidateList /> : <Dashboard />
      case 'candidate-detail':
        return SHOW_CANDIDATES ? <CandidateDetail id={view.id} /> : <Dashboard />
      case 'todo':
        return <TodoBoard />
      case 'reminders':
        return <Reminders />
      case 'settings':
        return <Settings />
    }
  }

  return <Layout>{renderView()}</Layout>
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen label="Checking session..." />
  }

  if (!user) {
    return <LoginPage />
  }

  return <AppContent />
}
