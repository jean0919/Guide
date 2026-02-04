
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 如果您的 GitHub Pages 網址是 https://<USERNAME>.github.io/<REPO>/
  // 請將 base 設定為 '/<REPO>/'。這裡使用 './' 以增加移植性。
  base: './',
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
