"use client";

import type { FormEvent } from "react";
import { useState, useContext } from "react";
import { SessionContext } from "@/context/session";
import { getGame } from "@/lib/game";
import { useRouter } from "next/navigation";

export default function JoinGame() {
  const session = useContext(SessionContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  async function submitJoinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) return;
    setButtonLoading(true);

    const target = e.target as HTMLFormElement;
    const codeEl = target.elements.namedItem("joinGameCode") as HTMLInputElement;

    let code = codeEl.value;
    if (code.startsWith("http") || code.startsWith("ches.su")) {
      code = new URL(code).pathname.split("/")[2];
    }

    const game = await getGame(code);

    if (game) {
      router.push(`/game/${game.code}`);
    } else {
      setButtonLoading(false);
      codeEl.value = "";
      // TODO: Show error message
    }
  }

  return (
    <form className="input-group" onSubmit={submitJoinGame}>
      <input
        type="text"
        placeholder="Invite link or code"
        className="input input-bordered"
        name="joinGameCode"
        id="joinGameCode"
      />
      <button className={"btn btn-square" + (buttonLoading ? " loading" : "")} type="submit">
        Join
      </button>
    </form>
  );
}
