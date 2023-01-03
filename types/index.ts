export interface Game {
    id?: number;
    pgn?: string;
    white?: User;
    black?: User;
    winner?: "white" | "black" | "draw";
    host?: User;
    code?: string;
    open?: boolean;
    observers?: User[];
}

export interface User {
    id?: number | string; // string for guest IDs
    name?: string;
    email?: string;
}
