"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useContext, useState } from "react";

import { SessionContext } from "@/context/session";
import { fetchActiveGame } from "@/lib/game";

export default function JoinGame() {
  const session = useContext(SessionContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  async function submitJoinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) return;

    const target = e.target as HTMLFormElement;
    const codeEl = target.elements.namedItem("joinGameCode") as HTMLInputElement;

    let code = codeEl.value;
    if (!code) return;

    setButtonLoading(true);

    if (code.startsWith("ches.su")) {
      code = "http://" + code;
    }
    if (code.startsWith("http")) {
      code = new URL(code).pathname.split("/")[1];
    }

    const game = await fetchActiveGame(code);

    if (game && game.code) {
      router.push(`/${game.code}`);
    } else {
      setButtonLoading(false);
      setNotFound(true);
      setTimeout(() => setNotFound(false), 5000);
      codeEl.value = "";
    }
  }

  return (
    <form
      className={"input-group" + (notFound ? " tooltip tooltip-error tooltip-open" : "")}
      data-tip="error: game not found"
      onSubmit={submitJoinGame}
    >
      <input
        type="text"
        placeholder="Invite link or code"
        className="input input-bordered"
        name="joinGameCode"
        id="joinGameCode"
      />
      <button
        className={
          "btn" +
          (buttonLoading ? " loading" : "") +
          (!session?.user?.id ? " btn-disabled text-base-content" : "")
        }
        type="submit"
      >
        Join
      </button>
    </form>
  );
}
