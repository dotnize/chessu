import { IconUser, IconSun, IconMoon } from "@tabler/icons-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar mx-1 w-auto justify-center drop-shadow-sm md:mx-16 lg:mx-40">
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost no-animation gap-1 text-xl normal-case hover:bg-transparent"
        >
          chessu
          <span className="badge badge-sm mt-1">alpha</span>
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
  );
}
