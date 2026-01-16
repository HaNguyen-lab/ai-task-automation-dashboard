import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: replace with your repo name
  base: '/ai-task-automation-dashboard/',
})
