import type { Game } from "@chessu/types";
import { API_URL } from "@/config";

export const createGame = async (side: string, unlisted: boolean) => {
    try {
        const res = await fetch(`${API_URL}/v1/games`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ side, unlisted }),
            cache: "no-store"
        });

        if (res && res.status === 201) {
            const game: Game = await res.json();
            return game;
        }
    } catch (err) {
        console.error(err);
    }
};

export const getGame = async (code: string) => {
    try {
        const res = await fetch(`${API_URL}/v1/games/${code}`, { cache: "no-store" });

        if (res && res.status === 200) {
            const game: Game = await res.json();
            return game;
        }
    } catch (err) {
        console.error(err);
    }
};

export const getPublicGames = async () => {
    try {
        const res = await fetch(`${API_URL}/v1/games`, { cache: "no-store" });

        if (res && res.status === 200) {
            const games: Game[] = await res.json();
            return games;
        }
    } catch (err) {
        console.error(err);
    }
};
