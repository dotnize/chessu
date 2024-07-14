import devServer, { defaultOptions } from "@hono/vite-dev-server";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
		devServer({
			entry: "./server/index.ts",
			exclude: [...defaultOptions.exclude, "/assets/**", "/app/**"],
			injectClientScript: false,
		}),
		tsconfigPaths(),
	],
});
