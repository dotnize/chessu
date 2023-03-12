import type { Action, CustomSquares, Lobby } from "@/types";

export function lobbyReducer(lobby: Lobby, action: Action): Lobby {
    switch (action.type) {
        case "updateLobby":
            return { ...lobby, ...action.payload };

        case "setSide":
            return { ...lobby, side: action.payload };

        case "setGame":
            return { ...lobby, actualGame: action.payload };

        default:
            throw new Error("Invalid action type");
    }
}

export function squareReducer(squares: CustomSquares, action: Partial<CustomSquares>) {
    return { ...squares, ...action };
}
