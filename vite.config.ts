import path from 'node:path'
import os from 'node:os'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// OneDrive can lock node_modules/.vite; use the OS temp dir for Vite's cache.
const cacheDir = path.join(os.tmpdir(), 'recruitbd-vite-cache')

const SUPABASE_URL_RE = /^https:\/\/[a-z0-9]+\.supabase\.co$/

function assertSupabaseEnv(url: string | undefined, key: string | undefined) {
  const u = url?.trim()
  const k = key?.trim()

  if (!u || !k) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
        'Set both in .env (local) or Vercel project settings (production), then rebuild.'
    )
  }

  if (!SUPABASE_URL_RE.test(u)) {
    throw new Error(
      `Invalid VITE_SUPABASE_URL: "${u}". Expected https://<project-ref>.supabase.co`
    )
  }

  if (u.includes('VITE_') || u.includes('your-project') || u.includes('placeholder')) {
    throw new Error(
      `VITE_SUPABASE_URL looks like a placeholder ("${u}"). Use your real Supabase project URL.`
    )
  }

  if (k.length < 100) {
    throw new Error(
      'VITE_SUPABASE_ANON_KEY looks too short. Copy the anon public key from Supabase → Settings → API.'
    )
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  assertSupabaseEnv(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

  return {
    plugins: [react(), tailwindcss()],
    cacheDir,
  }
})
