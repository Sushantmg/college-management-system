import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000,
    proxy: {
      '/auth': 'http://localhost:3005',
      '/courses': 'http://localhost:3005',
      '/departments': 'http://localhost:3005',
      '/students': 'http://localhost:3005',
      '/teachers': 'http://localhost:3005',
      '/enrollments': 'http://localhost:3005',
    },
  },
})
