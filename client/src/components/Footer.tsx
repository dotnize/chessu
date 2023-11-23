import { IconBrandGithub } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="footer border-base-300 dark:border-neutral text-base-content mx-1 mt-4 w-auto grid-flow-col items-center justify-between border-t-2 p-4 md:mx-16 lg:mx-40">
      <div className="items-center">
        <p>
          &copy; 2023{" "}
          <a
            href="https://n9ze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hover"
          >
            nize
          </a>
        </p>
      </div>
      <div className="items-center">
        <a
          href="https://github.com/dotnize/chessu"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm gap-1 normal-case"
        >
          <IconBrandGithub className="inline-block" size={16} />
          GitHub
        </a>
      </div>
    </footer>
  );
}
