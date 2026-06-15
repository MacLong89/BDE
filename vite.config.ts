import path from 'node:path'
import os from 'node:os'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// OneDrive can lock node_modules/.vite; use the OS temp dir for Vite's cache.
const cacheDir = path.join(os.tmpdir(), 'recruitbd-vite-cache')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir,
})
