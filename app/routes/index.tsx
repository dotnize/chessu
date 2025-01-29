import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import authClient from "~/lib/utils/auth-client";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    return {
      user: context.user,
    };
  },
});

function Home() {
  const { user } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold bg-green-500">TanStarter</h1>
      <div className="flex items-center gap-2">
        This is an unprotected page:
        <pre className="bg-base-200 border-base-300 rounded-md border p-1">
          routes/index.tsx
        </pre>
      </div>

      {user ? (
        <div className="flex flex-col gap-2">
          <p>Welcome back, {user.name}!</p>
          <Link to="/dashboard" className="btn btn-lg w-fit">
            Go to Dashboard
          </Link>
          <div>
            More data:
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>

          <button
            onClick={async () => {
              await authClient.signOut();
              router.invalidate();
            }}
            type="button"
            className="btn btn-lg btn-error w-fit"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p>You are not signed in.</p>
          <Link to="/signin" className="btn btn-lg w-fit">
            Sign in
          </Link>
        </div>
      )}

      <a
        className="text-muted-foreground hover:text-foreground underline"
        href="https://github.com/dotnize/tanstarter"
        target="_blank"
        rel="noreferrer noopener"
      >
        dotnize/tanstarter
      </a>
    </div>
  );
}
