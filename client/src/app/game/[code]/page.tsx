"use client";
// all of this in a client component for now to easily handle socket events

import { Chessboard } from "react-chessboard";
import { IconCopy } from "@tabler/icons-react";
import Image from "next/image";

const pgn = "1. e4 e5 2. f3 Nf6 3. d4 exd4 4. Qxd4 Nxe4 5. Qxe4+ Qe7 6. Qxe7+";

export default function Game() {
  return (
    <div className="flex w-full flex-wrap justify-center gap-6 px-4 py-4 lg:gap-10 2xl:gap-16">
      <div className="relative h-min">
        {/* overlay */}
        <div className="absolute top-0 right-0 bottom-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-70">
          <div className="bg-base-200 flex w-full items-center justify-center gap-4 py-4 px-2">
            Waiting for opponent.
            <button className="btn btn-secondary">Play as black</button>
          </div>
        </div>

        <Chessboard
          boardWidth={480}
          /* 350 for mobile, 480 for md up (^768px screen), 540 for 2xl up (^1536px), 580 for ^1920px  */
          customDarkSquareStyle={{ backgroundColor: "#4b7399" }}
          customLightSquareStyle={{ backgroundColor: "#eae9d2" }}
        />
      </div>

      <div className="flex max-w-lg flex-1 flex-col items-center justify-center gap-4">
        <div className="mb-auto flex w-full">
          <div className="flex flex-1 flex-col items-center justify-between">
            <div className="flex w-full items-center gap-1">
              <div className="avatar">
                <div className="w-8 rounded-md">
                  <Image src="/assets/default_avatar.png" alt="avatar" width={32} height={32} />
                </div>
              </div>
              nize
            </div>
            <div className="my-auto w-full text-sm">vs</div>
            <div className="flex w-full items-center gap-1">
              <div className="avatar">
                <div className="w-8 rounded-md">
                  <Image src="/assets/default_avatar.png" alt="avatar" width={32} height={32} />
                </div>
              </div>
              notnize
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div className="mb-2 flex w-full flex-col items-end gap-1">
              Invite friends:
              <div className="badge badge-md bg-base-300 text-base-content h-8 gap-1 font-mono text-xs sm:h-5 sm:text-sm">
                <IconCopy size={16} />
                ches.su/game/123abc
              </div>
            </div>
            <div className="h-36 w-full overflow-y-scroll">
              <table className="table-compact table w-full ">
                <tbody>
                  {pgn
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
            chatbox
            <div className="input-group mt-auto">
              <input
                type="text"
                placeholder="Chat here..."
                className="input input-bordered flex-grow"
              />
              <button className="btn btn-secondary ml-1">send</button>
            </div>
          </div>
        </div>
        <div className="w-full px-2 text-xs md:px-0">Spectators: nize, nize, nize</div>
      </div>
    </div>
  );
}
