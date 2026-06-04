import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // match CORS_ORIGIN default (http://localhost:3000)
  },
  build: {
    outDir: 'dist' // Vercel serves this
  }
});
