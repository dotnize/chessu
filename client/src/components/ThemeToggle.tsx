"use client";

import { IconSun, IconMoon } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => changeTheme(e.matches ? "dark" : "light"));

    changeTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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
      className="btn btn-ghost btn-circle"
    >
      {darkTheme ? (
        <IconSun className="m-auto block h-full" />
      ) : (
        <IconMoon className="m-auto block h-full" />
      )}
    </button>
  );
}
