import { useContext, useState, useEffect, useReducer } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard, Square, Pieces } from "react-chessboard";
import { SocketContext } from "../../context/socket";
import { SessionContext } from "../../context/session";
import type { Game } from "@types";

/**
 * bug: always on initial position on page load, regardless of game.fen()
        but works fine in production without StrictMode rendering the component twice
 *  */

const Board = () => {
  const socket = useContext(SocketContext);
  const session = useContext(SessionContext);

  const [size, setSize] = useState(400);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [game, _setGame] = useState(new Chess());
  const [side, setSide] = useState<"b" | "w" | "s">("s");

  const [moveFrom, setMoveFrom] = useState<string | Square>("");
  const [rightClickedSquares, setRightClickedSquares] = useState<{
    [square: string]: { backgroundColor: string } | undefined;
  }>({});
  const [optionSquares, setOptionSquares] = useState<{
    [square: string]: { background: string; borderRadius?: string };
  }>({});

  useEffect(() => {
    if (socket === null) return;

    window.addEventListener("resize", handleResize);
    handleResize();

    socket.on("receivedLatestGame", (latestGame: Game) => {
      if (latestGame.pgn) {
        const loadSuccess = game.loadPgn(latestGame.pgn);
        if (loadSuccess) {
          forceUpdate();
        }
      }
      if (latestGame.black?.id === session?.user.id) {
        if (side !== "b") setSide("b");
      } else if (latestGame.white?.id === session?.user.id) {
        if (side !== "w") setSide("w");
      } else if (side !== "s") {
        setSide("s");
      }
    });

    socket.on("receivedMove", (m: { from: string; to: string; promotion?: string }) => {
      const success = makeMove(m);
      if (!success) {
        socket.emit("getLatestGame");
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.off("receivedMove");
      socket.off("receivedLatestGame");
    };
  }, []);

  function handleResize() {
    const container = document.getElementById("root");
    if (!container || !container.offsetWidth) return;
    if (container.offsetWidth > 1600) {
      setSize(container.offsetWidth * 0.25);
    } else if (container.offsetWidth > 700) {
      setSize(container.offsetWidth * 0.35);
    } else {
      setSize(container.offsetWidth - 100);
    }
  }

  function makeMove(m: { from: string; to: string; promotion?: string }) {
    const result = game.move({ from: m.from, to: m.to });
    if (result) {
      setOptionSquares({
        [m.from]: { background: "rgba(255, 255, 0, 0.4)" },
        [m.to]: { background: "rgba(255, 255, 0, 0.4)" }
      });
    } else {
      setOptionSquares({});
    }
    return result;
  }

  function isDraggablePiece({ piece }: { piece: Pieces }) {
    if (side === "s") return true;
    return piece.startsWith(side);
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (side !== game.turn()) return false;

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    });
    if (move === null) return false; // illegal move
    socket?.emit("sendMove", { from: move.from, to: move.to });
    return true;
  }

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true
    }) as Move[];
    if (moves.length === 0) {
      return;
    }

    const newSquares: {
      [square: string]: { background: string; borderRadius?: string };
    } = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to as Square) &&
          game.get(move.to as Square)?.color !== game.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%"
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)"
    };
    setOptionSquares(newSquares);
  }

  function onPieceDragBegin(_piece: Pieces, sourceSquare: Square) {
    if (side !== game.turn()) return;

    getMoveOptions(sourceSquare);
  }
  function onPieceDragEnd() {
    setOptionSquares({});
  }

  function onSquareClick(square: Square) {
    setRightClickedSquares({});
    if (side !== game.turn()) return;

    function resetFirstMove(square: Square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    // from square
    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    const move = makeMove({
      from: moveFrom as Square,
      to: square,
      promotion: "q"
    });
    if (move === null) {
      resetFirstMove(square);
    } else {
      setMoveFrom("");
      socket?.emit("sendMove", { from: move.from, to: move.to });
    }
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square]?.backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    });
  }

  return (
    <Chessboard
      position={game.fen()}
      animationDuration={200}
      isDraggablePiece={isDraggablePiece}
      boardOrientation={side === "b" ? "black" : "white"}
      boardWidth={size}
      onPieceDragBegin={onPieceDragBegin}
      onPieceDragEnd={onPieceDragEnd}
      onPieceDrop={onDrop}
      onSquareClick={onSquareClick}
      onSquareRightClick={onSquareRightClick}
      customSquareStyles={{
        ...optionSquares,
        ...rightClickedSquares
      }}
    />
  );
};

export default Board;
