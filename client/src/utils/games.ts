import type { Game } from "@types";
import { apiUrl } from "../config/config";

export const createGame = async (side: string) => {
    const res = await fetch(`${apiUrl}/v1/games`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ side })
    });

    const game: Game | undefined = await res.json();
    return game;
};

export const findGame = async (code: string) => {
    const res = await fetch(`${apiUrl}/v1/games`);
    const games = await res.json();
    const game: Game | undefined = games.find((g: Game) => g.code === code);

    return game;
};
