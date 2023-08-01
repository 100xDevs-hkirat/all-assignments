import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '192.168.152.215',
    port: 5000,
  },
  server: {
    host: '192.168.214.215',
    port: 5173,
  }
})
