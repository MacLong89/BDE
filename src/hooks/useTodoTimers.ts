import { useEffect, useState } from 'react'
import { useApp } from '../store/AppContext'
import { isTimerElapsed, isTimerRunning, timerNotifyKey } from '../utils/todoTimer'

export function useTodoTimers() {
  const { data, completeTodoTimer } = useApp()
  const [now, setNow] = useState(() => Date.now())

  const hasRunningTimer = data.todos.some(isTimerRunning)

  useEffect(() => {
    if (!hasRunningTimer) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [hasRunningTimer])

  useEffect(() => {
    for (const todo of data.todos) {
      if (!isTimerRunning(todo)) continue
      if (!isTimerElapsed(todo, now)) continue

      const key = timerNotifyKey(todo)
      if (key && !sessionStorage.getItem(key)) {
        if (
          data.settings.notificationsEnabled &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          new Notification("Time's up!", {
            body: `${todo.title} — ${todo.durationMinutes} min complete`,
            icon: '/favicon.svg',
            tag: key,
          })
        }
        sessionStorage.setItem(key, '1')
      }

      completeTodoTimer(todo.id)
    }
  }, [now, data.todos, data.settings.notificationsEnabled, completeTodoTimer])

  return { now }
}
