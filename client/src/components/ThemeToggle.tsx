import { IconSun, IconMoon } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    if (document.documentElement.getAttribute("data-theme") === "chessustDark") {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
  }, []);

  function toggleTheme() {
    if (
      document.documentElement.getAttribute("data-theme") === "chessustDark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.setAttribute("data-theme", "chessustLight");
      localStorage.theme = "light";
      setDarkTheme(false);
    } else {
      document.documentElement.setAttribute("data-theme", "chessustDark");
      localStorage.theme = "dark";
      setDarkTheme(true);
    }
  }
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={"btn btn-ghost btn-circle swap swap-rotate" + (darkTheme ? " swap-active" : "")}
    >
      <IconSun className="swap-on m-auto block h-full" />
      <IconMoon className="swap-off m-auto block h-full" />
    </button>
  );
}
