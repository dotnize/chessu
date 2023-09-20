import type { Game, User } from "@chessu/types";
import type { Chess } from "chess.js";

export interface Lobby extends Game {
    actualGame: Chess;
    side: "b" | "w" | "s";
}

export interface CustomSquares {
    options: { [square: string]: { background: string; borderRadius?: string } };
    lastMove: { [square: string]: { background: string } };
    rightClicked: { [square: string]: { backgroundColor: string } | undefined };
    check: { [square: string]: { background: string; borderRadius?: string } };
}

export type Action =
    | {
          type: "updateLobby";
          payload: Partial<Lobby>;
      }
    | {
          type: "setSide";
          payload: Lobby["side"];
      }
    | {
          type: "setGame";
          payload: Chess;
      };

export interface Message {
    author: User;
    message: string;
}
