import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/AMIN-XP-GAMING/",
  plugins: [react()],
  server: {
    open: true,
    host: "localhost",
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
