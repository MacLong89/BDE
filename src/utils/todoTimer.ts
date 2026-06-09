import { parseISO } from 'date-fns'
import type { TodoItem } from '../types'

export function isTimerRunning(item: TodoItem): boolean {
  return Boolean(
    item.isTimed && item.timerStartedAt && item.durationMinutes && !item.timerEndedAt,
  )
}

export function getTimerEndTime(item: TodoItem): number | null {
  if (!item.timerStartedAt || !item.durationMinutes) return null
  return parseISO(item.timerStartedAt).getTime() + item.durationMinutes * 60 * 1000
}

export function getTimerRemainingSeconds(item: TodoItem, now = Date.now()): number | null {
  const end = getTimerEndTime(item)
  if (end === null) return null
  return Math.max(0, Math.ceil((end - now) / 1000))
}

export function isTimerElapsed(item: TodoItem, now = Date.now()): boolean {
  const end = getTimerEndTime(item)
  if (end === null) return false
  return now >= end
}

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function timerNotifyKey(item: TodoItem): string | null {
  if (!item.timerStartedAt) return null
  return `todo-timer-${item.id}-${item.timerStartedAt}`
}
