import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
  },
});

function DashboardLayout() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-4xl font-bold">Dashboard Layout</h1>
      <div className="flex items-center gap-2">
        This is a protected layout:
        <pre className="bg-base-200 border-base-300 rounded-md border p-1">
          routes/dashboard.tsx
        </pre>
      </div>

      <Link to="/" className="btn btn-lg w-fit">
        Back to Home
      </Link>

      <Outlet />
    </div>
  );
}
