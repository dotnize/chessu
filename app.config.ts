import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";

const config = await defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
  },

  // https://react.dev/learn/react-compiler
  react: {
    babel: {
      plugins: [
        [
          "babel-plugin-react-compiler",
          {
            target: "19",
          },
        ],
      ],
    },
  },

  tsr: {
    // https://github.com/TanStack/router/discussions/2863#discussioncomment-12458714
    appDirectory: "./src",
  },

  server: {
    experimental: {
      websocket: true,
    },

    // https://tanstack.com/router/latest/docs/framework/react/start/hosting#deployment
    // potential websocket dev issue: https://github.com/nitrojs/nitro/issues/2721
    preset: "node-server",
  },
});

config.addRouter({
  name: "websocket",
  type: "http",
  handler: "./src/lib/server/ws.ts",
  target: "server",
  base: "/_ws",
  plugins: () => [tsConfigPaths()],
});

export default config;
