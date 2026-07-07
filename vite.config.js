import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `BASE_PATH` is set by the GitHub Actions workflow to "/<repo-name>/" so
// assets resolve correctly on a project page (username.github.io/repo-name).
// Locally (npm run dev / npm run build without the env var) it falls back to "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
})
