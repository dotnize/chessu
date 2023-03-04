"use client";

import type { User } from "@chessu/types";

import { useState, useEffect } from "react";
import { SessionContext } from "./session";
import { fetchSession } from "@/lib/auth";

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({});

  async function getSession() {
    const user = await fetchSession();
    setUser(user || null);
  }

  useEffect(() => {
    getSession();
  }, []);

  return <SessionContext.Provider value={{ user, setUser }}>{children}</SessionContext.Provider>;
}
