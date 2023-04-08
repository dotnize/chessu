import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import icon from "../../public/images/chessu_icon.svg";

export default function Header() {
  return (
    <header className="navbar mx-1 w-auto justify-center drop-shadow-sm md:mx-16 lg:mx-40">
      <div className="flex flex-1 items-center gap-2">
        <Link
          href="/"
          className="btn btn-ghost no-animation gap-1 p-0 text-2xl normal-case hover:bg-transparent"
        >
          <Image src={icon} alt="chessu icon" height={30} />
          chessu
        </Link>
        <div className="dropdown dropdown-right hover:dropdown-open">
          <label tabIndex={0} className="badge badge-sm cursor-help">
            alpha
          </label>
          <div
            tabIndex={0}
            className="dropdown-content card card-compact bg-primary text-primary-content w-64 shadow"
          >
            <div className="card-body cursor-default">
              <p className="text-left text-xs">
                This project is a work in progress. You can view the roadmap{" "}
                <a
                  href="https://github.com/users/nizewn/projects/2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
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
