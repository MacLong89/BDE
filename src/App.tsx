import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { CompanyList } from './components/companies/CompanyList'
import { CompanyDetail } from './components/companies/CompanyDetail'
import { CandidateList } from './components/candidates/CandidateList'
import { CandidateDetail } from './components/candidates/CandidateDetail'
import { Reminders } from './components/Reminders'
import { Settings } from './components/Settings'
import { useNotifications } from './hooks/useNotifications'
import { useApp } from './store/AppContext'

function AppContent() {
  const { view } = useApp()
  useNotifications()

  const renderView = () => {
    switch (view.type) {
      case 'dashboard':
        return <Dashboard />
      case 'companies':
        return <CompanyList />
      case 'company-detail':
        return <CompanyDetail id={view.id} />
      case 'candidates':
        return <CandidateList />
      case 'candidate-detail':
        return <CandidateDetail id={view.id} />
      case 'reminders':
        return <Reminders />
      case 'settings':
        return <Settings />
    }
  }

  return <Layout>{renderView()}</Layout>
}

export default function App() {
  return <AppContent />
}
