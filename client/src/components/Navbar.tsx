import { IconUser, IconSun, IconMoon } from "@tabler/icons-react";

export default function Navbar() {
  return (
    <header className="navbar mx-1 w-auto justify-center drop-shadow-sm md:mx-16 lg:mx-40">
      <div className="flex-1">
        <span className="btn btn-ghost no-animation cursor-default gap-1 text-xl normal-case hover:bg-transparent">
          chessu
          <div className="dropdown hover:dropdown-open">
            <label tabIndex={0} className="badge badge-sm mt-1 cursor-help">
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
                    rel="noreferrer"
                    className="link"
                  >
                    here
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </span>
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
