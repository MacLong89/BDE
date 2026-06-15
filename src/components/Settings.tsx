import { Bell, Download, Upload } from 'lucide-react'
import { useRef } from 'react'
import { defaultAppData } from '../utils/storage'
import { useApp } from '../store/AppContext'
import { Button } from './ui/Button'
import { FieldGroup, Input, Label } from './ui/Input'

export function Settings() {
  const { data, updateSettings, replaceData } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)

  const requestNotifications = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission()
    }
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recruitbd-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string)
        replaceData({
          ...defaultAppData(),
          ...imported,
          settings: { ...defaultAppData().settings, ...imported.settings },
        })
      } catch {
        alert('Invalid backup file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500">Configure reminders and manage your data</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-pink-100 bg-white/90 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Reminder Defaults</h2>
          <p className="mt-1 text-sm text-slate-500">
            Applied to new companies and candidates. You can override per record.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FieldGroup>
              <Label>Default Follow-up Interval (days)</Label>
              <Input
                type="number"
                min={1}
                value={data.settings.defaultFollowUpDays}
                onChange={(e) =>
                  updateSettings({ defaultFollowUpDays: Number(e.target.value) })
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>LinkedIn Job Check Interval (days)</Label>
              <Input
                type="number"
                min={1}
                value={data.settings.linkedInCheckDays}
                onChange={(e) =>
                  updateSettings({ linkedInCheckDays: Number(e.target.value) })
                }
              />
            </FieldGroup>
          </div>
        </div>

        <div className="rounded-xl border border-pink-100 bg-white/90 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Notifications</h2>
          <p className="mt-1 text-sm text-slate-500">
            Browser notifications for high-priority overdue follow-ups.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.settings.notificationsEnabled}
                onChange={(e) =>
                  updateSettings({ notificationsEnabled: e.target.checked })
                }
                className="rounded border-slate-300"
              />
              Enable browser notifications
            </label>
            <Button variant="secondary" size="sm" onClick={requestNotifications}>
              <Bell className="h-4 w-4" /> Request Permission
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-pink-100 bg-white/90 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Data Backup</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your data syncs to your account in the cloud. Export a JSON backup anytime, or
            import to restore from a file.
          </p>
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" onClick={exportData}>
              <Download className="h-4 w-4" /> Export Backup
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Import Backup
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={importData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
