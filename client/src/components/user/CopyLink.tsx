"use client";

import { IconCopy } from "@tabler/icons-react";
import { useState } from "react";

export default function CopyLink({ name }: { name: string }) {
  const [copiedLink, setCopiedLink] = useState(false);

  function copyLink() {
    const text = `https://ches.su/user/${name}`;

    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 5000);
  }
  return (
    <div className={"dropdown dropdown-top dropdown-end" + (copiedLink ? " dropdown-open" : "")}>
      <label
        tabIndex={0}
        className="badge badge-md bg-base-300 text-base-content h-8 gap-1 font-mono text-xs sm:h-5 sm:text-sm"
        onClick={copyLink}
      >
        <IconCopy size={16} />
        ches.su/user/{name}
      </label>
      <div tabIndex={0} className="dropdown-content badge badge-neutral text-xs shadow">
        copied to clipboard
      </div>
    </div>
  );
}
