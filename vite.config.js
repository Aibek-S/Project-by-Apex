import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["670b2246c547.ngrok-free.app"],
    host: true,
  },
});
