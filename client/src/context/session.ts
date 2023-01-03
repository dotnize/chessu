import { User } from "@types";
import { createContext, Dispatch, SetStateAction } from "react";

export const SessionContext = createContext<{
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
} | null>(null);
