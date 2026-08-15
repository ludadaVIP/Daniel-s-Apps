import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // This workspace contains other Vite apps that use the default 5173 port.
    // Keep Bible Devotion on a stable, local-only address so `npm run dev`
    // always opens the same app instead of silently moving to another port.
    host: '127.0.0.1',
    port: 5181,
    strictPort: true,
    open: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
