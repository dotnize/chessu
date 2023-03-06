"use client";

import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      className={"btn btn-sm btn-ghost" + (isLoading ? " loading" : "")}
      onClick={handleRefresh}
    >
      <IconRefresh size={16} />
    </button>
  );
}
