import { Link } from "@remix-run/react";

const Header = () => {
  return (
    <header className="relative flex flex-col items-start justify-between bg-slate-700 sm:flex-row sm:items-center">
      <h1 className="z-10 m-2.5 text-2xl">chessu</h1>
      <input className="peer" type="checkbox" id="menu" hidden />
      <label
        htmlFor="menu"
        className="absolute right-0 p-5 sm:hidden peer-checked:[&_div:first-child]:translate-y-1.5 peer-checked:[&_div:first-child]:rotate-45 peer-checked:[&_div:last-child]:-translate-y-1 peer-checked:[&_div:last-child]:-rotate-45"
      >
        <div
          aria-hidden="true"
          className="m-auto h-0.5 w-6 rounded bg-blue-500 transition duration-300"
        ></div>
        <div
          aria-hidden="true"
          className="m-auto mt-2 h-0.5 w-6 rounded bg-blue-500 transition duration-300"
        ></div>
      </label>
      <div className="fixed flex h-full w-[calc(100%-4rem)] translate-x-[-100%] flex-col items-center bg-inherit pt-16 shadow-lg transition duration-300 peer-checked:translate-x-0 sm:static sm:flex sm:w-auto sm:translate-x-0 sm:flex-row sm:bg-inherit sm:pt-0 [&_a]:block [&_a]:text-center hover:[&_a]:bg-blue-500">
        <nav className="w-full sm:w-auto">
          <ul className="flex flex-col sm:flex-row">
            <li>
              <Link className="p-5" to="/">
                Play
              </Link>
            </li>
            <li>
              <Link className="p-5" to="/games">
                Watch
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex w-full items-center sm:w-auto">
          <button className="w-full p-5 sm:w-auto">themebtn</button>
          <button className="w-full p-5 sm:w-auto">Sign in</button>
        </div>
      </div>
    </header>
  );
};
export default Header;
