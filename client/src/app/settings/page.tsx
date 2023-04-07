"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";
import { useContext, useState } from "react";
import { updateUser } from "@/lib/auth";

export default function Settings() {
  const session = useContext(SessionContext);
  const router = useRouter();

  const [buttonLoading, setButtonLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  if (!session || session.user === undefined) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-xl">Loading user...</div>
      </div>
    );
  }

  if (session.user === null) {
    router.replace("/");
    return;
  }

  async function updateAccount(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const updateUsername = target.elements.namedItem("updateUsername") as HTMLInputElement;
    const updateEmail = target.elements.namedItem("updateEmail") as HTMLInputElement;
    const updatePassword = target.elements.namedItem("updatePassword") as HTMLInputElement;

    const newName =
      !updateUsername.value || updateUsername.value === session?.user?.name
        ? undefined
        : updateUsername.value;
    const newEmail =
      !updateEmail.value || updateEmail.value === session?.user?.email
        ? undefined
        : updateEmail.value;

    if (!newName && !newEmail && !updatePassword.value) return;

    setButtonLoading(true);
    const user = await updateUser(newName, newEmail, updatePassword.value || undefined);

    if (typeof user === "string") {
      setServerMessage(user);
    } else if (user?.id) {
      session?.setUser(user);
      setServerMessage("Account updated successfully");
      setTimeout(() => {
        setServerMessage(null);
      }, 5000);
    }

    updatePassword.value = "";
    setButtonLoading(false);
  }
  return (
    <div className="flex w-full flex-col justify-center md:w-1/2">
      <h2 className="text-2xl font-bold">Account settings</h2>

      <form className="form-control mt-4" onSubmit={updateAccount}>
        <label className="label" htmlFor="updateUsername">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          pattern="[A-Za-z0-9]+"
          title="Alphanumeric characters only"
          id="updateUsername"
          name="updateUsername"
          placeholder={session.user.name || "Username"}
          defaultValue={session.user.name || undefined}
          className="input input-bordered w-full"
          maxLength={16}
          minLength={2}
        />
        <label className="label" htmlFor="updateEmail">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          className="input input-bordered w-full"
          id="updateEmail"
          name="updateEmail"
          placeholder={session.user.email || "Email address"}
          defaultValue={session.user.email}
          minLength={4}
        />
        <label className="label" htmlFor="updatePassword">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          className="input input-bordered w-full"
          id="updatePassword"
          name="updatePassword"
          placeholder="New password (optional)"
          minLength={3}
        />
        {serverMessage && (
          <div className={serverMessage.includes("successful") ? "text-success" : "text-error"}>
            {serverMessage}
          </div>
        )}
        <div className="mt-4">
          <button type="submit" className={"btn" + (buttonLoading ? " loading" : "")}>
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
