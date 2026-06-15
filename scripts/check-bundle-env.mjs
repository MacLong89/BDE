import fs from 'node:fs'
import path from 'node:path'

const assetsDir = path.join(process.cwd(), 'dist', 'assets')
const jsFile = fs
  .readdirSync(assetsDir)
  .find((f) => f.startsWith('index-') && f.endsWith('.js'))

if (!jsFile) {
  console.error('No index-*.js in dist/assets')
  process.exit(1)
}

const content = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8')
const urls = [...content.matchAll(/https:\/\/[a-z0-9]+\.supabase\.co/g)].map((m) => m[0])
const viteRefs = [...content.matchAll(/VITE_SUPABASE[^"'\s]*/g)].map((m) => m[0])
const gS = content.match(/gS="[^"]*"/)

console.log('Bundle:', jsFile)
console.log('Supabase URLs:', urls.length ? urls.slice(0, 3) : 'NONE')
if (viteRefs.length) {
  console.log('VITE literals (likely from UI text):', viteRefs.slice(0, 3))
}
if (gS) console.log('gS assignment:', gS[0])

const badGs = gS && !gS[0].includes('supabase.co')
if (!urls.length || badGs) {
  console.error(
    '\nBuild verification FAILED: the JS bundle does not embed a valid Supabase URL.\n' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before building, then redeploy.\n'
  )
  process.exit(1)
}

console.log('\nBuild verification OK: Supabase URL is embedded in the bundle.')
