import { createAPIFileRoute } from "@tanstack/start/api";
import { setCookie } from "vinxi/http";

import { auth } from "~/lib/server/auth";
import { encrypt } from "~/lib/server/jwt";

export const APIRoute = createAPIFileRoute("/api/auth/jwt")({
  GET: async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return new Response(null, { status: 401 });
    }

    const jwt = await encrypt({ userId: session.user.id });

    setCookie("access_token", jwt, {
      path: "/_ws", // accessible only in websocket route
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      // maxAge: 60 * 60 * 2,
      // 1 day for now
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
    });

    return new Response(null, { status: 200 });
  },
});
