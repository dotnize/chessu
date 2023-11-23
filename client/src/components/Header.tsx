import { IconExternalLink, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="navbar border-base-300 dark:border-neutral mx-1 w-auto justify-center border-b-2 md:mx-16 lg:mx-40">
      <div className="flex flex-1 items-center gap-2">
        <Link
          href="/"
          className="btn btn-ghost no-animation p-0 text-2xl normal-case hover:bg-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="h-8 w-8"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 288 512.66"
          >
            <path d="M237.84 383.74c13.61 23.9 35.9 48.09 32.29 80.27H17.83c-3.62-32.18 21.67-56.37 35.28-80.27h184.73zM69.68 120.41h148.64c7.51 0 13.66 6.18 13.66 13.66s-6.18 13.66-13.66 13.66H69.68c-7.48 0-13.66-6.15-13.66-13.66s6.15-13.66 13.66-13.66zM120.55 0h48.95v56.29c0 3.87 3.18 7.04 7.04 7.04h24.32c3.86 0 6.32-3.23 7.04-7.04L218.59 0h43.56L244.7 85.8c-4.01 12.59-13.6 18.96-28.35 19.63H66.56c-12.93-.28-20.33-6.82-22.54-19.63L25.85 0h45.62l10.69 56.29c.71 3.81 3.17 7.04 7.03 7.04h24.32c3.86 0 7.04-3.17 7.04-7.04V0zM70.94 162.75c-1.5 60.45-7.75 119.42-22.87 158.47h191.86c-17.59-44.3-24.65-102.49-26.68-158.47H70.94zM46.28 336.2h195.44c8.94 0 16.26 7.36 16.26 16.26v.01c0 8.9-7.36 16.26-16.26 16.26H46.28c-8.9 0-16.26-7.32-16.26-16.26v-.01c0-8.94 7.32-16.26 16.26-16.26zM16.82 479.03h254.36c9.25 0 16.82 7.57 16.82 16.81v.01c0 9.25-7.57 16.81-16.82 16.81H16.82C7.57 512.66 0 505.1 0 495.85v-.01c0-9.24 7.57-16.81 16.82-16.81z" />
          </svg>
          chessu
        </Link>
        <a
          title="Project roadmap"
          className="badge badge-sm badge-secondary gap-0.5"
          href="https://github.com/users/dotnize/projects/2"
          target="_blank"
          rel="noopener noreferrer"
        >
          pre-alpha
          <IconExternalLink size={12} />
        </a>
      </div>
      <div className="flex-none">
        <ThemeToggle />
        <label tabIndex={0} htmlFor="auth-modal" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <IconUser className="m-auto block h-full" />
          </div>
        </label>
      </div>
    </header>
  );
}
