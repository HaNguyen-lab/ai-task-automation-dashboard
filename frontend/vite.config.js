import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to your repo name exactly:
export default defineConfig({
  plugins: [react()],
  base: '/ai-task-automation-dashboard/',
})
