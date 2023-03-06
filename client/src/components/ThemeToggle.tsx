"use client";

import { IconSun, IconMoon } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const onChange = (e: MediaQueryListEvent) => changeTheme(e.matches ? "dark" : "light");

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onChange);

    changeTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", onChange);
    };
  }, []);

  function changeTheme(theme: "dark" | "light") {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "chessuDark");
      setDarkTheme(true);
    } else {
      document.documentElement.setAttribute("data-theme", "chessuLight");
      setDarkTheme(false);
    }
  }
  return (
    <button
      type="button"
      onClick={() => changeTheme(darkTheme ? "light" : "dark")}
      className={"btn btn-ghost btn-circle swap swap-rotate" + (darkTheme ? " swap-active" : "")}
    >
      <IconSun className="swap-on m-auto block h-full" />
      <IconMoon className="swap-off m-auto block h-full" />
    </button>
  );
}
