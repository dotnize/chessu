import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
  },

  server: {
    experimental: {
      websocket: true,
    },

    // https://tanstack.com/router/latest/docs/framework/react/start/hosting#deployment
    // potential websocket dev issue: https://github.com/nitrojs/nitro/issues/2721
    preset: "bun",
  },
}).addRouter({
  name: "websocket",
  type: "http",
  handler: "./lib/server/ws.ts",
  target: "server",
  base: "/_ws",
  plugins: () => [tsConfigPaths()],
});
