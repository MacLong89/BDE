import type { AppData } from '../types'

const STORAGE_KEY = 'recruitbd-data'

export const defaultAppData = (): AppData => ({
  companies: [],
  roles: [],
  candidates: [],
  submissions: [],
  settings: {
    defaultFollowUpDays: 7,
    linkedInCheckDays: 3,
    notificationsEnabled: true,
  },
})

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultAppData()
    const parsed = JSON.parse(raw) as AppData
    return {
      ...defaultAppData(),
      ...parsed,
      settings: { ...defaultAppData().settings, ...parsed.settings },
    }
  } catch {
    return defaultAppData()
  }
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
