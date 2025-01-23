import { createFileRoute, redirect } from "@tanstack/react-router";
import authClient from "~/lib/utils/auth-client";

export const Route = createFileRoute("/signin")({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-base-200 flex flex-col items-center gap-8 rounded-xl p-10">
        Logo here
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              authClient.signIn.social({ provider: "discord" });
            }}
            type="button"
            className="btn btn-lg btn-soft w-fit"
          >
            Sign in with Discord
          </button>
          <button
            onClick={() => {
              authClient.signIn.social({ provider: "github" });
            }}
            type="button"
            className="btn btn-lg btn-soft w-fit"
          >
            Sign in with GitHub
          </button>
          <button
            onClick={() => {
              authClient.signIn.social({ provider: "google" });
            }}
            type="button"
            className="btn btn-lg btn-soft w-fit"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
