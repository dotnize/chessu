"use client";

import type { FormEvent } from "react";
import { useRef, useState, useContext } from "react";
import { SessionContext } from "@/context/session";
import { setGuestSession } from "@/lib/auth";

// TODO: add login and register views

export default function AuthModal() {
  const session = useContext(SessionContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const modalToggleRef = useRef<HTMLInputElement>(null);

  async function updateGuestName(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const guestName = target.elements.namedItem("guestName") as HTMLInputElement;
    if (!guestName || !guestName.value) return;

    setButtonLoading(true);
    const user = await setGuestSession(guestName.value);
    if (user) {
      session?.setUser(user);
      if (modalToggleRef.current?.checked) {
        modalToggleRef.current.checked = false;
      }
    }
    guestName.value = "";
    setButtonLoading(false);
  }

  return (
    <>
      <input type="checkbox" id="auth-modal" className="modal-toggle" ref={modalToggleRef} />

      <label
        htmlFor="auth-modal"
        className={"modal" + (session?.user === null ? " modal-open" : "")}
      >
        <label className="modal-box flex flex-col gap-4 pt-2">
          <div className="flex w-full gap-2">
            <div className="tabs flex-grow">
              <a className="tab tab-bordered tab-active flex-grow">Guest</a>
              <a className="tab tab-bordered tab-disabled flex-grow">Login</a>
              <a className="tab tab-bordered tab-disabled flex-grow">Register</a>
            </div>
            {session?.user !== null && (
              <label htmlFor="auth-modal" className="btn btn-sm btn-circle btn-ghost">
                ✕
              </label>
            )}
          </div>

          <form className="flex flex-col" onSubmit={updateGuestName}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Hello, {session?.user?.name || "unknown guest"}!</span>
              </label>
              <label className="input-group">
                <span>Name</span>
                <input
                  type="text"
                  pattern="[A-Za-z0-9_]+"
                  title="Alphanumeric characters and underscores only"
                  id="guestName"
                  name="guestName"
                  placeholder="Enter name here..."
                  className="input input-bordered flex-grow"
                  maxLength={16}
                  minLength={2}
                  required
                />
              </label>
            </div>
            <div className="modal-action">
              <button className={"btn" + (buttonLoading ? " loading" : "")} type="submit">
                Update
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  );
}
