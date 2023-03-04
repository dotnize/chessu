import type { Game } from "@chessu/types";
import { API_URL } from "@/config";

export const createGame = async (side: string, unlisted: boolean) => {
    const res = await fetch(`${API_URL}/v1/games`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ side, unlisted })
    });

    const game: Game | undefined = await res.json();
    return game;
};

export const findGame = async (code: string) => {
    const res = await fetch(`${API_URL}/v1/games/${code}`);

    if (res && res.status === 200) {
        const game: Game = await res.json();
        return game;
    }
};
