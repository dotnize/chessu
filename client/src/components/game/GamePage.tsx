"use client";
// TODO: restructure

import { Chessboard } from "react-chessboard";
import { IconCopy } from "@tabler/icons-react";
import { useState, useEffect, useContext, useReducer, useRef } from "react";
import type { KeyboardEvent, FormEvent } from "react";
//import Image from "next/image";
import type { Game } from "@chessu/types";
import type { Message } from "@/types";

import { io } from "socket.io-client";
import { API_URL } from "@/config";
import { SessionContext } from "@/context/session";
import { Chess } from "chess.js";
import type { Square, Move } from "chess.js";
import { initSocket, lobbyReducer, squareReducer } from "./handlers";

const socket = io(API_URL, { withCredentials: true, autoConnect: false });

export default function GamePage({ initialLobby }: { initialLobby: Game }) {
  const session = useContext(SessionContext);

  const [lobby, updateLobby] = useReducer(lobbyReducer, {
    ...initialLobby,
    actualGame: new Chess(),
    side: "s"
  });

  const [customSquares, updateCustomSquares] = useReducer(squareReducer, {
    options: {},
    lastMove: {},
    rightClicked: {},
    check: {}
  });

  const [moveFrom, setMoveFrom] = useState<string | Square>("");

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [boardWidth, setBoardWidth] = useState(480);

  const [playBtnLoading, setPlayBtnLoading] = useState(false);

  const chatlistRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!session?.user || !session.user?.id) return;
    socket.connect();

    window.addEventListener("resize", handleResize);
    handleResize();

    if (lobby.pgn && lobby.actualGame.pgn() !== lobby.pgn) {
      const gameCopy = new Chess();
      gameCopy.loadPgn(lobby.pgn as string);
      updateLobby({ type: "setGame", payload: gameCopy });

      const lastMove = gameCopy.history({ verbose: true }).pop();

      let lastMoveSquares = undefined;
      let kingSquare = undefined;
      if (lastMove) {
        lastMoveSquares = {
          [lastMove.from]: { background: "rgba(255, 255, 0, 0.4)" },
          [lastMove.to]: { background: "rgba(255, 255, 0, 0.4)" }
        };
      }
      if (gameCopy.inCheck()) {
        const kingPos = gameCopy.board().reduce((acc, row, index) => {
          const squareIndex = row.findIndex(
            (square) => square && square.type === "k" && square.color === gameCopy.turn()
          );
          return squareIndex >= 0 ? `${String.fromCharCode(squareIndex + 97)}${8 - index}` : acc;
        }, "");
        kingSquare = {
          [kingPos]: {
            background: "radial-gradient(red, rgba(255,0,0,.4), transparent 70%)",
            borderRadius: "50%"
          }
        };
      }
      updateCustomSquares({
        lastMove: lastMoveSquares,
        check: kingSquare
      });
    }

    if (lobby.black?.id === session?.user?.id) {
      if (lobby.side !== "b") updateLobby({ type: "setSide", payload: "b" });
    } else if (lobby.white?.id === session?.user?.id) {
      if (lobby.side !== "w") updateLobby({ type: "setSide", payload: "w" });
    } else if (lobby.side !== "s") {
      updateLobby({ type: "setSide", payload: "s" });
    }

    initSocket(session.user, socket, lobby, {
      updateLobby,
      addMessage,
      updateCustomSquares,
      makeMove
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.removeAllListeners();
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto scroll down when new message is added
  useEffect(() => {
    const chatlist = chatlistRef.current;
    if (!chatlist) return;
    chatlist.scrollTop = chatlist.scrollHeight;
  }, [chatMessages]);

  function handleResize() {
    if (window.innerWidth >= 1920) {
      setBoardWidth(580);
    } else if (window.innerWidth >= 1536) {
      setBoardWidth(540);
    } else if (window.innerWidth >= 768) {
      setBoardWidth(480);
    } else {
      setBoardWidth(350);
    }
  }

  function addMessage(message: Message) {
    setChatMessages((prev) => [...prev, message]);
  }

  function sendChat(message: string) {
    if (!session?.user) return;

    socket.emit("chat", message);
    addMessage({ author: session.user, message });
  }

  function chatKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      if (!input.value || input.value.length == 0) return;
      sendChat(input.value);
      input.value = "";
    }
  }

  function chatClickSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const input = target.elements.namedItem("chatInput") as HTMLInputElement;
    if (!input.value || input.value.length == 0) return;
    sendChat(input.value);
    input.value = "";
  }

  function makeMove(m: { from: string; to: string; promotion?: string }) {
    try {
      const result = lobby.actualGame.move(m);
      if (result) {
        let kingSquare = undefined;
        if (lobby.actualGame.inCheck()) {
          const kingPos = lobby.actualGame.board().reduce((acc, row, index) => {
            const squareIndex = row.findIndex(
              (square) => square && square.type === "k" && square.color === lobby.actualGame.turn()
            );
            return squareIndex >= 0 ? `${String.fromCharCode(squareIndex + 97)}${8 - index}` : acc;
          }, "");
          kingSquare = {
            [kingPos]: {
              background: "radial-gradient(red, rgba(255,0,0,.4), transparent 70%)",
              borderRadius: "50%"
            }
          };
        }
        updateCustomSquares({
          lastMove: {
            [result.from]: { background: "rgba(255, 255, 0, 0.4)" },
            [result.to]: { background: "rgba(255, 255, 0, 0.4)" }
          },
          options: {},
          check: kingSquare
        });
        return true;
      } else {
        throw new Error("Invalid move");
      }
    } catch (err) {
      updateCustomSquares({
        options: {}
      });
      console.log(m);
      console.log(err);
      return false;
    }
  }

  function isDraggablePiece({ piece }: { piece: string }) {
    if (lobby.side === "s") return true;
    return piece.startsWith(lobby.side);
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (lobby.side !== lobby.actualGame.turn()) return false;

    const moveDetails = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    };

    const move = makeMove(moveDetails);
    if (!move) return false; // illegal move
    socket.emit("sendMove", moveDetails);
    return true;
  }

  function getMoveOptions(square: Square) {
    const moves = lobby.actualGame.moves({
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
          lobby.actualGame.get(move.to as Square) &&
          lobby.actualGame.get(move.to as Square)?.color !== lobby.actualGame.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%"
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)"
    };
    updateCustomSquares({ options: newSquares });
  }

  function onPieceDragBegin(_piece: string, sourceSquare: Square) {
    if (lobby.side !== lobby.actualGame.turn()) return;

    getMoveOptions(sourceSquare);
  }

  function onPieceDragEnd() {
    updateCustomSquares({ options: {} });
  }

  function onSquareClick(square: Square) {
    updateCustomSquares({ rightClicked: {} });
    if (lobby.side !== lobby.actualGame.turn()) return;

    function resetFirstMove(square: Square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    // from square
    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    const moveDetails = {
      from: moveFrom,
      to: square,
      promotion: "q"
    };

    const move = makeMove(moveDetails);
    if (!move) {
      resetFirstMove(square);
    } else {
      setMoveFrom("");
      socket.emit("sendMove", moveDetails);
    }
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    updateCustomSquares({
      rightClicked: {
        ...customSquares.rightClicked,
        [square]:
          customSquares.rightClicked[square] &&
          customSquares.rightClicked[square]?.backgroundColor === colour
            ? undefined
            : { backgroundColor: colour }
      }
    });
  }

  function clickPlay(e: FormEvent<HTMLButtonElement>) {
    setPlayBtnLoading(true);
    e.preventDefault();
    socket.emit("joinAsPlayer");
  }

  return (
    <div className="flex w-full flex-wrap justify-center gap-6 px-4 py-4 lg:gap-10 2xl:gap-16">
      <div className="relative h-min">
        {/* overlay */}
        {(!lobby.white?.id || !lobby.black?.id) && (
          <div className="absolute top-0 right-0 bottom-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-70">
            <div className="bg-base-200 flex w-full items-center justify-center gap-4 py-4 px-2">
              Waiting for opponent.
              {session?.user?.id !== lobby.white?.id && session?.user?.id !== lobby.black?.id && (
                <button
                  className={"btn btn-secondary" + (playBtnLoading ? " btn-disabled" : "")}
                  onClick={clickPlay}
                >
                  Play as {lobby.white?.id ? "black" : "white"}
                </button>
              )}
            </div>
          </div>
        )}

        <Chessboard
          boardWidth={boardWidth}
          customDarkSquareStyle={{ backgroundColor: "#4b7399" }}
          customLightSquareStyle={{ backgroundColor: "#eae9d2" }}
          position={lobby.actualGame.fen()}
          boardOrientation={lobby.side === "b" ? "black" : "white"}
          isDraggablePiece={isDraggablePiece}
          onPieceDragBegin={onPieceDragBegin}
          onPieceDragEnd={onPieceDragEnd}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          customSquareStyles={{
            ...customSquares.lastMove,
            ...customSquares.check,
            ...customSquares.rightClicked,
            ...customSquares.options
          }}
        />
      </div>

      <div className="flex max-w-lg flex-1 flex-col items-center justify-center gap-4">
        <div className="mb-auto flex w-full">
          <div className="flex flex-1 flex-col items-center justify-between">
            <div className="flex w-full items-center gap-1">
              {session?.user?.id === lobby.black?.id
                ? lobby.white?.name || "(no one)"
                : lobby.black?.name || "(no one)"}
            </div>
            <div className="my-auto w-full text-sm">vs</div>
            <div className="flex w-full items-center gap-1">
              {session?.user?.id === lobby.black?.id
                ? lobby.black?.name || "(no one)"
                : lobby.white?.name || "(no one)"}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div className="mb-2 flex w-full flex-col items-end gap-1">
              Invite friends:
              <div className="badge badge-md bg-base-300 text-base-content h-8 gap-1 font-mono text-xs sm:h-5 sm:text-sm">
                <IconCopy size={16} />
                ches.su/game/{initialLobby.code} {/* TODO */}
              </div>
            </div>
            <div className="h-36 w-full overflow-y-scroll">
              <table className="table-compact table w-full ">
                <tbody>
                  {(lobby.actualGame.pgn() || "")
                    .split(/\d+\./)
                    .filter((move) => move.trim() !== "")
                    .map((moveSet, i) => {
                      const moves = moveSet.trim().split(" ");
                      return (
                        <tr className="flex w-full items-center gap-1" key={i + 1}>
                          <td className="">{i + 1}.</td>
                          <td className="w-1/2 text-center">{moves[0]}</td>
                          <td className="w-1/2 text-center">{moves[1]}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="h-60 w-full min-w-fit">
          <div className="bg-base-300 flex h-full w-full min-w-[64px] flex-col rounded-lg p-4 shadow-sm">
            <ul
              className="mb-4 flex flex-col gap-1 overflow-y-scroll break-words"
              ref={chatlistRef}
            >
              {chatMessages.map((m, i) => (
                <li className="max-w-[30rem]" key={i}>
                  {m.author.name}: {m.message}
                </li>
              ))}
            </ul>
            <form className="input-group mt-auto" onSubmit={chatClickSend}>
              <input
                type="text"
                placeholder="Chat here..."
                className="input input-bordered flex-grow"
                name="chatInput"
                id="chatInput"
                onKeyUp={chatKeyUp}
                required
              />
              <button className="btn btn-secondary ml-1" type="submit">
                send
              </button>
            </form>
          </div>
        </div>
        {lobby.observers && lobby.observers.length > 0 && (
          <div className="w-full px-2 text-xs md:px-0">
            Spectators: {lobby.observers?.map((o) => o.name).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
