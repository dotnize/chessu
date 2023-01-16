import type { User } from "@types";
import { apiUrl } from "../config/config";

export const fetchSession = async () => {
    const res = await fetch(`${apiUrl}/v1/auth`, {
        credentials: "include"
    });

    if (res.status === 200) {
        const user: User = await res.json();
        return user;
    }
};

export const setGuestSession = async (name: string) => {
    const res = await fetch(`${apiUrl}/v1/auth/guest`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    });
    if (res.status === 201) {
        const user: User = await res.json();
        return user;
    }
};
