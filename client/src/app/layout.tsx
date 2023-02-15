import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head />
      <body>
        <div className="drawer drawer-mobile">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-circle btn-ghost drawer-button fixed right-1 top-1 lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M12 18h8"
                />
              </svg>
            </label>
            {children}
          </div>
          <nav className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu text-base-content bg-base-300 w-80 p-4 lg:w-60">
              <h1 className="btn btn-ghost btn-block no-animation btn-square hover:bg-transparent">
                chessu
              </h1>
              <li>
                <a>Play</a>
              </li>
              <li>
                <a>Login</a>
              </li>
              <li>
                <a>Register</a>
              </li>
            </ul>
          </nav>
        </div>
        <footer className="footer footer-center bg-base-300 text-base-content p-4">
          <div>
            <p>Copyright &copy; 2023 nize - GitHub</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
