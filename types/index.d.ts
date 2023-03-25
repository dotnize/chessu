export interface Game {
    id?: number;
    pgn?: string;
    white?: User;
    black?: User;
    winner?: "white" | "black" | "draw";
    reason?: string;
    host?: User;
    code?: string;
    unlisted?: boolean;
    timeout?: number;
    observers?: User[];
}

export interface User {
    id?: number | string; // string for guest IDs
    name?: string | null;
    email?: string;

    // mainly for players, not spectators
    connected?: boolean;
    disconnectedOn?: number;
}
