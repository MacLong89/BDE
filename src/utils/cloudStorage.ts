import { supabase } from '../lib/supabase'
import type { AppData } from '../types'
import { defaultAppData, loadAppData } from './storage'

function normalizeAppData(raw: Partial<AppData> | null | undefined): AppData {
  const base = defaultAppData()
  if (!raw) return base
  return {
    ...base,
    ...raw,
    companies: raw.companies ?? base.companies,
    roles: raw.roles ?? base.roles,
    candidates: raw.candidates ?? base.candidates,
    submissions: raw.submissions ?? base.submissions,
    todos: raw.todos ?? base.todos,
    settings: { ...base.settings, ...raw.settings },
  }
}

export function hasAppContent(data: AppData): boolean {
  return (
    data.companies.length > 0 ||
    data.candidates.length > 0 ||
    data.todos.length > 0 ||
    data.roles.length > 0 ||
    data.submissions.length > 0
  )
}

export async function fetchUserData(userId: string): Promise<AppData | null> {
  if (!supabase) throw new Error('Supabase is not configured')

  const { data, error } = await supabase
    .from('user_app_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data?.data) return null
  return normalizeAppData(data.data as Partial<AppData>)
}

export async function saveUserData(userId: string, appData: AppData): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')

  const { error } = await supabase.from('user_app_data').upsert(
    {
      user_id: userId,
      data: appData,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )

  if (error) throw error
}

export async function loadDataForUser(userId: string): Promise<AppData> {
  const cloud = await fetchUserData(userId)
  const local = loadAppData()

  if (cloud && hasAppContent(cloud)) return cloud

  if (hasAppContent(local)) {
    await saveUserData(userId, local)
    return local
  }

  if (cloud) return cloud
  return defaultAppData()
}
