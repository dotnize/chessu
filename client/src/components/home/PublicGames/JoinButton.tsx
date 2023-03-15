"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function JoinButton({ code }: { code: string }) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  function handleJoin() {
    startTransition(() => {
      router.push(`/${code}`);
    });
  }

  return (
    <button
      className={
        "btn btn-ghost btn-xs focus:opacity-100 lg:opacity-0 lg:group-hover:opacity-100" +
        (isLoading ? " btn-disabled" : "")
      }
      onClick={handleJoin}
    >
      Join
    </button>
  );
}
