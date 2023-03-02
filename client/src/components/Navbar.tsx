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
        <label tabIndex={0} htmlFor="auth-modal" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <IconUser className="m-auto block h-full" />
          </div>
        </label>
      </div>
    </header>
  );
}
