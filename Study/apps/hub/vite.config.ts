import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  publicDir: '../../public',
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ['react', 'react-dom', 'react-router-dom'] },
  server: {
    port: 3456,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        rewrite: (url) => url.replace(/^\/api/, ''),
      },
    },
  },
});
