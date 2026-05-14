import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, the Vite server (5173) proxies API + audio calls to the single
// Flask backend (8000). In production, Flask serves the built dist directly.
const apiTarget = process.env.API_TARGET || "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false,
    proxy: {
      "/api": apiTarget,
      "/audio": apiTarget,
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
