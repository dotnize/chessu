import { PropsWithChildren, useEffect, useState } from "react";
import type { User } from "@types";

import { SocketContext, socket } from "./socket";
import { SessionContext } from "./session";

import { fetchSession } from "../utils/auth";

const ContextProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState<User>({});

  async function getSession() {
    const user = await fetchSession();
    if (user) {
      setUser(user);
    }
  }

  useEffect(() => {
    getSession();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <SessionContext.Provider value={{ user, setUser }}>{props.children}</SessionContext.Provider>
    </SocketContext.Provider>
  );
};
export default ContextProvider;
