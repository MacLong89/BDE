import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  continueWithEmail: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let finished = false
    const finishLoading = () => {
      if (!finished) {
        finished = true
        setLoading(false)
      }
    }

    const timeout = window.setTimeout(finishLoading, 8000)

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(data.session?.user ?? null)
        finishLoading()
      })
      .catch(() => finishLoading())

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      finishLoading()
    })

    return () => {
      window.clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const continueWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Cloud login is not configured yet.' }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (!signInError) return {}

    const signInMsg = signInError.message.toLowerCase()
    const canTrySignUp =
      signInMsg.includes('invalid login') || signInMsg.includes('invalid credentials')

    if (!canTrySignUp) {
      return { error: signInError.message }
    }

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      const signUpMsg = signUpError.message.toLowerCase()
      if (signUpMsg.includes('already registered') || signUpMsg.includes('already exists')) {
        return { error: 'That email is already in use. Check your password and try again.' }
      }
      return { error: signUpError.message }
    }

    if (data.session) return {}

    return {
      error:
        'Account may need email confirmation. In Supabase, turn off Confirm email under Authentication → Providers → Email.',
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const value = useMemo(
    () => ({ user, loading, continueWithEmail, signOut }),
    [user, loading, continueWithEmail, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { isSupabaseConfigured }
