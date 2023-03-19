"use client";

import { SessionContext } from "@/context/session";
import { login, logout, register, setGuestSession, updateUser } from "@/lib/auth";
import type { FormEvent } from "react";
import { useContext, useEffect, useRef, useState } from "react";

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
    await logout();
    session?.setUser(null);
  }

  async function updateAccount(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const updateEmail = target.elements.namedItem("updateEmail") as HTMLInputElement;
    const updatePassword = target.elements.namedItem("updatePassword") as HTMLInputElement;
    if (
      !updateEmail ||
      !updatePassword ||
      ((!updateEmail.value || updateEmail.value === session?.user?.email) && !updatePassword.value)
    )
      return;

    setButtonLoading(true);
    const user = await updateUser(
      updateEmail.value || undefined,
      updatePassword.value || undefined
    );
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
            <div className="flex flex-col pt-2">
              <div className="flex w-full justify-between">
                <div className="div">
                  Logged in as <b>{session.user.name}</b>
                </div>
                <a className="link" onClick={clickLogout}>
                  Logout
                </a>
              </div>

              <form className="form-control mt-2" onSubmit={updateAccount}>
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
                  <div
                    className={serverMessage.includes("successful") ? "text-success" : "text-error"}
                  >
                    {serverMessage}
                  </div>
                )}
                <div className="mt-2">
                  <button type="submit" className={"btn" + (buttonLoading ? " loading" : "")}>
                    Update
                  </button>
                </div>
              </form>

              <div className="modal-action">
                <label htmlFor="auth-modal" className="btn">
                  Close
                </label>
              </div>
            </div>
          ) : (
            <>
              <div className="tabs flex-nowap w-full">
                <a
                  onClick={() => {
                    setActiveTab("guest");
                  }}
                  className={
                    "tab tab-bordered flex-grow" + (activeTab === "guest" ? " tab-active" : "")
                  }
                >
                  Guest
                </a>
                <a
                  onClick={() => setActiveTab("login")}
                  className={
                    "tab tab-bordered flex-grow" + (activeTab === "login" ? " tab-active" : "")
                  }
                >
                  Login
                </a>
                <a
                  onClick={() => setActiveTab("register")}
                  className={
                    "tab tab-bordered flex-grow" + (activeTab === "register" ? " tab-active" : "")
                  }
                >
                  Register
                </a>
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
