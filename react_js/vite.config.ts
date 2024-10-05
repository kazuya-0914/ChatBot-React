import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Djangoの「chatbotapp」アプリのstaticフォルダを指定
    outDir: '../chatbotapp/static/dist',
    manifest: true,
    rollupOptions: {
      input: './src/main.tsx',  // Vite のエントリーポイントファイル
    },
  },
})
