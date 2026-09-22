import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// In dev, the Vite server (5175) proxies API + audio calls to the single
// Flask backend (8005). In production, Flask serves the built dist directly.
const apiTarget = process.env.API_TARGET || "http://127.0.0.1:8005";
const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Resolve the frontend from this config file so a Windows junction does not
  // mix the logical launch path with the physical source path during builds.
  root: projectRoot,
  server: {
    host: "127.0.0.1",
    port: 5175,
    strictPort: true,
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
