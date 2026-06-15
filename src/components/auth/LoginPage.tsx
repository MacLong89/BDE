import { useState } from 'react'
import { isSupabaseConfigured, useAuth } from '../../store/AuthContext'
import { Button } from '../ui/Button'
import { FieldGroup, Input, Label } from '../ui/Input'

export function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    if (mode === 'signin') {
      const result = await signIn(email.trim(), password)
      if (result.error) setError(result.error)
    } else {
      const result = await signUp(email.trim(), password)
      if (result.error) setError(result.error)
      if (result.message) setMessage(result.message)
    }
    setSubmitting(false)
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-pink-100 bg-white/90 p-8 shadow-lg">
          <h1 className="text-xl font-bold text-slate-900">Cloud login not configured</h1>
          <p className="mt-3 text-sm text-slate-600">
            Add your Supabase keys to a <code className="text-pink-700">.env</code> file:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">
{`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
          <p className="mt-4 text-sm text-slate-500">
            See <code className="text-pink-700">supabase/schema.sql</code> and the README for
            setup steps.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-pink-100 bg-white/90 p-8 shadow-lg backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-sm font-bold text-white">
            R
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">RecruitBD</h1>
            <p className="text-sm text-slate-500">Sign in to access your data anywhere</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </FieldGroup>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          {message && (
            <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting
              ? 'Please wait...'
              : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="font-medium text-pink-600 hover:text-pink-700"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError('')
              setMessage('')
            }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
