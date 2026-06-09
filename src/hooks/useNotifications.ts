import { useEffect } from 'react'
import { useApp } from '../store/AppContext'
import { computeReminders } from '../utils/reminders'

const NOTIFIED_KEY = 'recruitbd-notified'

function getNotifiedToday(): Set<string> {
  try {
    const raw = sessionStorage.getItem(NOTIFIED_KEY)
    if (!raw) return new Set()
    const { date, ids } = JSON.parse(raw) as { date: string; ids: string[] }
    const today = new Date().toDateString()
    if (date !== today) return new Set()
    return new Set(ids)
  } catch {
    return new Set()
  }
}

function markNotified(id: string) {
  const today = new Date().toDateString()
  const current = getNotifiedToday()
  current.add(id)
  sessionStorage.setItem(
    NOTIFIED_KEY,
    JSON.stringify({ date: today, ids: [...current] }),
  )
}

export function useNotifications() {
  const { data } = useApp()

  useEffect(() => {
    if (!data.settings.notificationsEnabled) return
    if (!('Notification' in window)) return

    const run = async () => {
      if (Notification.permission === 'default') {
        await Notification.requestPermission()
      }
      if (Notification.permission !== 'granted') return

      const notified = getNotifiedToday()
      const reminders = computeReminders(data).filter((r) => r.priority === 'high')

      for (const reminder of reminders.slice(0, 3)) {
        if (notified.has(reminder.id)) continue
        new Notification('RecruitBD Reminder', {
          body: reminder.description,
          icon: '/favicon.svg',
          tag: reminder.id,
        })
        markNotified(reminder.id)
      }
    }

    run()
    const interval = setInterval(run, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [data])
}
