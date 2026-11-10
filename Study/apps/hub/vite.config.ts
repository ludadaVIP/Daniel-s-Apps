import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { webHost, webPort } from '../../scripts/local-config.json';

export default defineConfig({
  publicDir: '../../public',
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ['react', 'react-dom', 'react-router-dom'] },
  server: {
    host: webHost,
    port: webPort,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        rewrite: (url) => url.replace(/^\/api/, ''),
      },
    },
  },
});
