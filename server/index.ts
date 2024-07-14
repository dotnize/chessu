import { Hono } from "hono";
import { logger } from "hono/logger";
import { remix } from "remix-hono/handler";

const viteDevServer =
	process.env.NODE_ENV === "production"
		? undefined
		: await import("vite").then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
					//appType: "custom",
				}),
			);

// /* type your adapter bindings here */
// type Bindings = {};
// /* type your Hono variables (used with c.get/c.set) here */
// type Variables = {};
// type ContextEnv = { Bindings: Bindings; Variables: Variables };

// const app = new Hono<ContextEnv>();
const app = new Hono();

// basic logger
app.use(logger());

// Add the Remix middleware to your Hono server
app.use(
	"*",
	remix({
		build: viteDevServer
			? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
			: // @ts-ignore
				await import("../build/server/index.js"),
		mode: process.env.NODE_ENV as "development" | "production",
		// getLoadContext is optional, the default function is the same as here
		getLoadContext(c) {
			return c.env;
		},
	}),
);

export default app;
