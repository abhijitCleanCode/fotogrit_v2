import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ["https://cms-s.fotogrit.id","https://cms-dev.fotogrit.id","https://cms.fotogrit.id","cms-dev.fotogrit.id","cms.fotogrit.id","cms-s.fotogrit.id"],//process.env.VITE_ALLOWED_HOSTS?.split(',') || []
  },
});
