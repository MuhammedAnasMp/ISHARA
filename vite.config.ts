import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // allowedHosts: ["500b-31-214-0-214.ngrok-free.app"],
    allowedHosts: ["curvy-schools-tap.loca.lt"],
  },
})
