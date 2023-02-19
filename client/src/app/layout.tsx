import "./globals.css";
import { IconUser, IconSun, IconMoon, IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head />
      <body>
        <header className="navbar mx-1 w-auto justify-center drop-shadow-sm md:mx-16 lg:mx-40">
          <div className="flex-1">
            <Link
              href="/"
              className="btn btn-ghost no-animation gap-1 text-xl normal-case hover:bg-transparent"
            >
              chessu
              <span className="badge badge-sm">alpha</span>
            </Link>
          </div>
          <div className="flex-none">
            <div className="btn btn-ghost btn-circle">
              <IconSun className="m-auto block h-full" />
            </div>
            <div className="dropdown dropdown-end">
              {/* ^ wrap this in client component too */}
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <IconUser className="m-auto block h-full" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content rounded-box bg-base-100 w-52 p-2 shadow"
              >
                <li>
                  <a>Change guest name</a>
                </li>
                <li>
                  <a className="pointer-events-none justify-between">
                    Sign in
                    <span className="badge">WIP</span>
                  </a>
                </li>
                <li>
                  <a className="pointer-events-none">Register</a>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <main className="bg-base-200 mx-1 my-8 flex min-h-[70vh] justify-center rounded-3xl shadow-md md:mx-16 lg:mx-40">
          {children}
        </main>
        <footer className="footer text-base-content mx-1 mt-4 w-auto grid-flow-col items-center justify-between p-4 md:mx-16 lg:mx-40">
          <div className="items-center">
            <p>
              &copy; 2023{" "}
              <a href="https://nize.ph" target="_blank" rel="noreferrer" className="link-hover">
                nize
              </a>
            </p>
          </div>
          <div className="items-center">
            <a
              href="https://github.com/nizewn/chessu"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm gap-1 normal-case"
            >
              <IconBrandGithub className="inline-block" size={16} />
              GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
