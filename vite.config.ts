import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// Multi-page build: one real HTML file per page and language.
// The SSR build (used only for prerendering) takes its entry from the CLI.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // No SPA fallback: unknown URLs 404 locally, like on the static host.
  appType: "mpa",
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            en: resolve(__dirname, "index.html"),
            sr: resolve(__dirname, "sr/index.html"),
            privacy: resolve(__dirname, "privacy/index.html"),
            srPrivatnost: resolve(__dirname, "sr/privatnost/index.html"),
          },
        },
      },
}));
