import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Single bundle - no code splitting to avoid chunk loading issues
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
    chunkSizeWarningLimit: 3000,
    sourcemap: false,
  },
  publicDir: 'public',
  server: {
    port: 5173,
  },
  preview: {
    port: 5173,
  },
  // Define environment variables explicitly
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://nltzetpmvsbazhhkuqiq.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdHpldHBtdnNiYXpoaGt1cWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDg2ODcsImV4cCI6MjA4NTc4NDY4N30.g00kuoKfzb1z4sPI5anoQTbjSTR6uSR5M_ovRxWcFcM'),
  },
})