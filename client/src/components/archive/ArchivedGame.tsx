"use client";

import { Game } from "@chessu/types";
import { Chessboard } from "react-chessboard";
import { useEffect, useReducer, useState, useRef } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconPlayerSkipBack,
  IconPlayerSkipForward
} from "@tabler/icons-react";
import type { Square } from "chess.js";
import { Chess } from "chess.js";
import type { CustomSquares } from "@/types";
import { IconRotateClockwise2 } from "@tabler/icons-react";

export default function ArchivedGame({ game }: { game: Game }) {
  const [boardWidth, setBoardWidth] = useState(480);
  const moveListRef = useRef<HTMLDivElement>(null);
  const [navFen, setNavFen] = useState<string | null>(null);
  const [navIndex, setNavIndex] = useState<number | null>(null);
  const [flipBoard, setFlipBoard] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPgn, setShowPgn] = useState(true);
  const actualGame = new Chess();
  actualGame.loadPgn(game.pgn as string);

  const [customSquares, updateCustomSquares] = useReducer(
    (squares: CustomSquares, action: Partial<CustomSquares>) => {
      return { ...squares, ...action };
    },
    {
      options: {},
      lastMove: {},
      rightClicked: {},
      check: {}
    }
  );

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

  // auto scroll for moves
  useEffect(() => {
    const activeMoveEl = document.getElementById("activeNavMove");
    const moveList = moveListRef.current;
    if (!activeMoveEl || !moveList) return;
    moveList.scrollTop = activeMoveEl.offsetTop;
  });

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function copyLink() {
    const text = `https://ches.su/archive/${game.id}`;
    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 5000);
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

  function getMoveListHtml() {
    const history = actualGame.history({ verbose: true });
    const movePairs = history
      .slice(history.length / 2)
      .map((_, i) => history.slice((i *= 2), i + 2));

    return movePairs.map((moves, i) => {
      return (
        <tr className="flex w-full items-center gap-1" key={i + 1}>
          <td className="">{i + 1}.</td>
          <td
            className={
              "btn btn-ghost btn-xs h-full w-2/5 font-normal normal-case" +
              ((history.indexOf(moves[0]) === history.length - 1 && navIndex === null) ||
              navIndex === history.indexOf(moves[0])
                ? " btn-active pointer-events-none rounded-none"
                : "")
            }
            id={
              (history.indexOf(moves[0]) === history.length - 1 && navIndex === null) ||
              navIndex === history.indexOf(moves[0])
                ? "activeNavMove"
                : ""
            }
            onClick={() => navigateMove(history.indexOf(moves[0]))}
          >
            {moves[0].san}
          </td>
          {moves[1] && (
            <td
              className={
                "btn btn-ghost btn-xs h-full w-2/5 font-normal normal-case" +
                ((history.indexOf(moves[1]) === history.length - 1 && navIndex === null) ||
                navIndex === history.indexOf(moves[1])
                  ? " btn-active pointer-events-none rounded-none"
                  : "")
              }
              id={
                (history.indexOf(moves[1]) === history.length - 1 && navIndex === null) ||
                navIndex === history.indexOf(moves[1])
                  ? "activeNavMove"
                  : ""
              }
              onClick={() => navigateMove(history.indexOf(moves[1]))}
            >
              {moves[1].san}
            </td>
          )}
        </tr>
      );
    });
  }

  function navigateMove(index: number | null | "prev") {
    const history = actualGame.history({ verbose: true });

    if (index === null || (index !== "prev" && index >= history.length - 1) || !history.length) {
      // last move
      setNavIndex(null);
      setNavFen(null);
      return;
    }

    if (index === "prev") {
      index = history.length - 2;
    } else if (index < 0) {
      index = 0;
    }

    setNavIndex(index);
    setNavFen(history[index].after);
  }

  function getNavMoveSquares() {
    const history = actualGame.history({ verbose: true });

    if (!history.length) return;

    let index = navIndex ?? history.length - 1;

    return {
      [history[index].from]: { background: "rgba(255, 255, 0, 0.4)" },
      [history[index].to]: { background: "rgba(255, 255, 0, 0.4)" }
    };
  }

  function getPlayerHtml(side: "top" | "bottom") {
    const blackHtml = (
      <div className="flex w-full flex-col justify-center">
        <a
          className={
            "font-bold" +
            (typeof game.black?.id === "number" ? " text-primary link-hover" : " cursor-default")
          }
          href={typeof game.black?.id === "number" ? `/user/${game.black?.name}` : undefined}
          target="_blank"
          rel="noreferrer"
        >
          {game.black?.name}
        </a>
        <span className="flex items-center gap-1 text-xs">black</span>
      </div>
    );
    const whiteHtml = (
      <div className="flex w-full flex-col justify-center">
        <a
          className={
            "font-bold" +
            (typeof game.white?.id === "number" ? " text-primary link-hover" : " cursor-default")
          }
          href={typeof game.white?.id === "number" ? `/user/${game.white?.name}` : undefined}
          target="_blank"
          rel="noreferrer"
        >
          {game.white?.name}
        </a>
        <span className="flex items-center gap-1 text-xs">white</span>
      </div>
    );
    if (flipBoard) {
      return side === "top" ? whiteHtml : blackHtml;
    } else {
      return side === "top" ? blackHtml : whiteHtml;
    }
  }

  return (
    <div className="flex w-full flex-wrap justify-center gap-6 px-4 py-4 lg:gap-10 2xl:gap-16">
      <div className="h-min">
        <Chessboard
          boardWidth={boardWidth}
          customDarkSquareStyle={{ backgroundColor: "#4b7399" }}
          customLightSquareStyle={{ backgroundColor: "#eae9d2" }}
          position={navFen || actualGame.fen()}
          boardOrientation={flipBoard ? "black" : "white"}
          isDraggablePiece={() => false}
          onSquareClick={() => updateCustomSquares({ rightClicked: {} })}
          onSquareRightClick={onSquareRightClick}
          customSquareStyles={{
            ...getNavMoveSquares(),
            ...customSquares.rightClicked
          }}
        />
      </div>

      <div className="flex max-w-lg flex-1 flex-col items-center justify-center gap-4">
        <div className="mb-auto flex w-full p-2">
          <div className="flex flex-1 flex-col items-center justify-between">
            {getPlayerHtml("top")}
            <div className="my-auto flex w-full items-center">
              <button className="btn btn-sm gap-1" onClick={() => setFlipBoard(!flipBoard)}>
                <IconRotateClockwise2 size={18} />
                Flip board
              </button>
            </div>
            {getPlayerHtml("bottom")}
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div className="mb-2 flex w-full flex-col items-end gap-1">
              Archived link:
              <div
                className={
                  "dropdown dropdown-top dropdown-end" + (copiedLink ? " dropdown-open" : "")
                }
              >
                <label
                  tabIndex={0}
                  className="badge badge-md bg-base-300 text-base-content h-8 gap-1 font-mono text-xs sm:h-5 sm:text-sm"
                  onClick={copyLink}
                >
                  <IconCopy size={16} />
                  ches.su/archive/{game.id}
                </label>
                <div tabIndex={0} className="dropdown-content badge badge-neutral text-xs shadow">
                  copied to clipboard
                </div>
              </div>
            </div>
            <div className="h-32 w-full overflow-y-scroll" ref={moveListRef}>
              <table className="table-compact table w-full">
                <tbody>{getMoveListHtml()}</tbody>
              </table>
            </div>
            <div className="flex h-4 w-full">
              <button
                className={
                  "btn btn-sm flex-grow rounded-r-none" +
                  (navIndex === 0 || actualGame.history().length <= 1 ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(0)}
              >
                <IconPlayerSkipBack size={18} />
              </button>
              <button
                className={
                  "btn btn-sm flex-grow rounded-none" +
                  (navIndex === 0 || actualGame.history().length <= 1 ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(navIndex === null ? "prev" : navIndex - 1)}
              >
                <IconChevronLeft size={18} />
              </button>
              <button
                className={
                  "btn btn-sm flex-grow rounded-none" + (navIndex === null ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(navIndex === null ? null : navIndex + 1)}
              >
                <IconChevronRight size={18} />
              </button>
              <button
                className={
                  "btn btn-sm flex-grow rounded-l-none" + (navIndex === null ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(null)}
              >
                <IconPlayerSkipForward size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-60 w-full min-w-fit">
          <div className="bg-base-300 flex h-full w-full min-w-[64px] flex-col rounded-lg p-4 shadow-sm">
            {game.endReason === "abandoned"
              ? game.winner === "draw"
                ? "The game ended in a draw due to abandonment."
                : `The game was won by ${game.winner} due to abandonment.`
              : game.winner === "draw"
              ? "The game ended in a draw."
              : `The game was won by checkmate (${game.winner}).`}

            <div className="mt-2 flex items-center justify-end">
              <button
                className={
                  "btn btn-sm rounded-b-none rounded-tr-none normal-case" +
                  (showPgn ? " btn-primary" : "")
                }
                onClick={() => setShowPgn(true)}
              >
                Final PGN
              </button>
              <div className="tooltip" data-tip="Current board position is shown.">
                <button
                  className={
                    "btn btn-sm rounded-b-none rounded-tl-none normal-case" +
                    (showPgn ? "" : " btn-primary")
                  }
                  onClick={() => setShowPgn(false)}
                >
                  Current FEN
                </button>
              </div>
            </div>
            <textarea
              className="textarea h-full rounded-tr-none"
              readOnly
              value={showPgn ? game.pgn : navFen || actualGame.fen()}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
