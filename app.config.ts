import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },

  server: {
    experimental: {
      websocket: true,
    },

    // https://tanstack.com/router/latest/docs/framework/react/start/hosting#deployment
    // preset: "cloudflare-pages",
  },
}).addRouter({
  name: "websocket",
  type: "http",
  handler: "./app/ws.ts",
  target: "server",
  base: "/_ws",
  plugins: () => [tsConfigPaths()],
});
