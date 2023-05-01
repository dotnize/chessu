"use client";

import { SessionContext } from "@/context/session";
import { login, logout, register, setGuestSession } from "@/lib/auth";
import Link from "next/link";
import type { FormEvent } from "react";
import { useContext, useEffect, useRef, useState } from "react";

import { IconSettings2, IconUserCircle } from "@tabler/icons-react";
import Guest from "./Guest";
import Login from "./Login";
import Register from "./Register";

export default function AuthModal() {
  const session = useContext(SessionContext);
  const [activeTab, setActiveTab] = useState<"guest" | "login" | "register">("guest");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const modalToggleRef = useRef<HTMLInputElement>(null);

  async function clickLogout() {
    if (serverMessage) {
      setServerMessage(null);
    }
    setActiveTab("login");
    await logout();
    session?.setUser(null);
  }

  async function submitAuth(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    if (activeTab === "guest") {
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
    } else if (activeTab === "login") {
      const loginName = target.elements.namedItem("loginName") as HTMLInputElement;
      const loginPassword = target.elements.namedItem("loginPassword") as HTMLInputElement;
      if (!loginName || !loginName.value || !loginPassword || !loginPassword.value) return;

      setButtonLoading(true);
      const user = await login(loginName.value, loginPassword.value);
      if (typeof user === "string") {
        setServerMessage(user);
      } else if (user?.id) {
        session?.setUser(user);
        if (serverMessage) {
          setServerMessage(null);
        }
        if (modalToggleRef.current?.checked) {
          modalToggleRef.current.checked = false;
        }
      }
    } else if (activeTab === "register") {
      const registerName = target.elements.namedItem("registerName") as HTMLInputElement;
      const registerEmail = target.elements.namedItem("registerEmail") as HTMLInputElement;
      const registerPassword = target.elements.namedItem("registerPassword") as HTMLInputElement;
      if (!registerName || !registerName.value || !registerPassword || !registerPassword.value) {
        return;
      }

      setButtonLoading(true);
      const user = await register(
        registerName.value,
        registerPassword.value,
        registerEmail.value || undefined
      );

      if (typeof user === "string") {
        setServerMessage(user);
      } else if (user?.id) {
        session?.setUser(user);
        if (serverMessage) {
          setServerMessage(null);
        }
        if (modalToggleRef.current?.checked) {
          modalToggleRef.current.checked = false;
        }
      }
    }
    setButtonLoading(false);
  }

  useEffect(() => {
    setServerMessage(null);
  }, [activeTab]);

  return (
    <>
      <input type="checkbox" id="auth-modal" className="modal-toggle" ref={modalToggleRef} />

      <label
        htmlFor="auth-modal"
        className={"modal" + (session?.user === null ? " modal-open" : "")}
      >
        <label className="modal-box flex max-w-sm flex-col gap-4 pt-2">
          {session?.user?.id && typeof session.user.id === "number" ? (
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex w-full justify-between">
                <div>
                  Logged in as <b>{session.user.name}</b>
                </div>
                <a className="link" onClick={clickLogout}>
                  Logout
                </a>
              </div>
              <div className="flex w-full flex-col">
                <Link
                  className="btn btn-ghost gap-1 normal-case"
                  href={`/user/${session.user.name}`}
                  onClick={() => ((modalToggleRef.current as HTMLInputElement).checked = false)}
                >
                  <IconUserCircle /> View profile
                </Link>
                <Link
                  className="btn btn-ghost gap-1 normal-case"
                  href="/settings"
                  onClick={() => ((modalToggleRef.current as HTMLInputElement).checked = false)}
                >
                  <IconSettings2 /> Account settings
                </Link>
              </div>

              <div className="modal-action">
                <label htmlFor="auth-modal" className="btn">
                  Close
                </label>
              </div>
            </div>
          ) : (
            <>
              <div className="tabs flex-nowap w-full">
                <span
                  onClick={() => {
                    setActiveTab("guest");
                  }}
                  className={
                    "tab tab-bordered tab-border-2 flex-grow rounded-tl-lg" +
                    (activeTab === "guest"
                      ? " tab-active text-base-content"
                      : " text-base-content border-opacity-10 hover:border-opacity-30")
                  }
                >
                  Guest
                </span>
                <span
                  onClick={() => setActiveTab("login")}
                  className={
                    "tab tab-bordered tab-border-2 flex-grow rounded-tl-lg" +
                    (activeTab === "login"
                      ? " tab-active"
                      : " text-base-content border-opacity-10 hover:border-opacity-30")
                  }
                >
                  Login
                </span>
                <span
                  onClick={() => setActiveTab("register")}
                  className={
                    "tab tab-bordered tab-border-2 flex-grow rounded-tl-lg" +
                    (activeTab === "register"
                      ? " tab-active"
                      : " text-base-content border-opacity-10 hover:border-opacity-30")
                  }
                >
                  Register
                </span>
              </div>

              <form className="flex flex-col px-2" onSubmit={submitAuth}>
                {activeTab === "guest" && (
                  <Guest currentName={session?.user?.name || "unknown user"} />
                )}
                {activeTab === "login" && <Login />}
                {activeTab === "register" && <Register />}

                {serverMessage && <div className="text-error mt-2">{serverMessage}</div>}
                <div className="modal-action items-center">
                  {session?.user !== null && (
                    <label htmlFor="auth-modal" className="btn btn-ghost">
                      Close
                    </label>
                  )}
                  <button className={"btn" + (buttonLoading ? " loading" : "")} type="submit">
                    {activeTab === "guest" && "Confirm"}
                    {activeTab === "login" && "Login"}
                    {activeTab === "register" && "Register"}
                  </button>
                </div>
              </form>
            </>
          )}
        </label>
      </label>
    </>
  );
}
