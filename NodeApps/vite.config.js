import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 5888,
    strictPort: true,
    proxy: {
      '/insight': 'http://127.0.0.1:5889',
      '/notebook': 'http://127.0.0.1:5889',
      '/html-library': 'http://127.0.0.1:5889',
      '/bible': 'http://127.0.0.1:5889',
      '/recall-verses': 'http://127.0.0.1:5889',
      '/investment': 'http://127.0.0.1:5889',
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
