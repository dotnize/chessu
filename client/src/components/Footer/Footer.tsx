import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      made with &hearts; by{" "}
      <a href="https://nize.ph" target="_blank" rel="noreferrer">
        nize
      </a>
      <br />
      &copy; {new Date().getFullYear()} —{" "}
      <a
        href="https://github.com/nizewn/chessu"
        className={styles.github}
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </footer>
  );
};

export default Footer;
