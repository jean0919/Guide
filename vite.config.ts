
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 假設您的 GitHub Repository 名稱是 Guide
  // 則部署後的網址會是 https://jean0919.github.io/Guide/
  base: '/Guide/',
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
