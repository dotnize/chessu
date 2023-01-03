import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.css";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

const Header = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => changeTheme(e.matches ? "dark" : "light"));

    changeTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  function changeTheme(theme: "dark" | "light") {
    if (theme === "dark") {
      if (!document.body.classList.contains("dark-theme")) {
        document.body.classList.add("dark-theme");
      }
      setDarkTheme(true);
    } else {
      if (document.body.classList.contains("dark-theme")) {
        document.body.classList.remove("dark-theme");
      }
      setDarkTheme(false);
    }
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.title}>
        chessu
      </Link>
      <button
        className={styles.themeToggle}
        type="button"
        onClick={() => changeTheme(darkTheme ? "light" : "dark")}
      >
        {darkTheme ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
};

export default Header;
