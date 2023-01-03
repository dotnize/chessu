import { MouseEvent, KeyboardEvent, useRef } from "react";
import { useParams } from "react-router-dom";
import Board from "../../components/Board/Board";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../../context/socket";
import { SessionContext } from "../../context/session";
import type { Game, User } from "@types";

import styles from "./Game.module.css";
import { CopyIcon, PersonIcon } from "@radix-ui/react-icons";

interface Message {
  author: User;
  message: string;
}

const Game = () => {
  const { gameCode } = useParams();
  const [game, setGame] = useState<Game>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useContext(SocketContext);
  const session = useContext(SessionContext);

  const chatlistRef = useRef<HTMLUListElement>(null);

  function joinAsPlayer(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    socket?.emit("joinAsPlayer");
  }

  function handleCopy(type: "link" | "code") {
    const text = type === "code" ? game.code : `https://ches.su/game/${game.code}`;
    if (!text) return;
    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
  }

  function addMessage(m: Message) {
    setMessages((msgs) => [...msgs, m]);
  }

  function chatKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      if (!value || value.length === 0) return;
      socket?.emit("chat", value);
      addMessage({ author: session?.user as User, message: value });
      (e.target as HTMLInputElement).value = "";
    }
  }

  useEffect(() => {
    // auto scroll down when new message is added
    const box = chatlistRef.current;
    if (!box) return;
    box.scrollTop = box.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (socket === null) {
      console.log("socket is null");
      return;
    }

    socket.on("receivedLatestLobby", (g: Game) => {
      setGame(g);
    });

    socket.on("userJoined", (name: string) => {
      addMessage({ author: { name: "server" }, message: `${name} has joined the lobby.` });
    });
    socket.on("userLeft", (name: string) => {
      addMessage({ author: { name: "server" }, message: `${name} has left the lobby.` });
    });
    socket.on("userJoinedAsPlayer", ({ name, side }: { name: string; side: string }) => {
      addMessage({ author: { name: "server" }, message: `${name} is now playing ${side}.` });
    });
    socket.on("chat", (m: Message) => {
      addMessage(m);
    });
    socket.on(
      "gameOver",
      ({
        reason,
        winnerName,
        winnerSide
      }: {
        reason: string;
        winnerName?: string;
        winnerSide?: string;
      }) => {
        const m = {
          author: { name: "game" }
        } as Message;

        if (reason === "checkmate") {
          m.message = `${winnerName}(${winnerSide}) has won by checkmate.`;
        } else {
          let message = "The game has ended in a draw";
          if (reason === "repetition") {
            message = message.concat(" due to threefold repetition");
          } else if (reason === "insufficient") {
            message = message.concat(" due to insufficient material");
          } else if (reason === "stalemate") {
            message = "The game has been drawn due to stalemate";
          }
          m.message = message.concat(".");
        }
        addMessage(m);
      }
    );

    socket.connect();
    socket.emit("joinLobby", gameCode);
    return () => {
      socket.off("receivedLatestLobby");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("userJoinedAsPlayer");
      socket.off("chat");
      socket.off("gameOver");
      socket.disconnect();
    };
  }, []);

  return (
    <div className={styles.game}>
      <div className={styles.boardContainer}>
        {/* had no brain cells left when i was writing this, sorry */}
        {game.black?.id === session?.user.id ? (
          game.white?.name ? (
            <div className={styles.playerNameTop}>
              <PersonIcon /> {game.white?.name}
            </div>
          ) : (
            ""
          )
        ) : game.white?.id === session?.user.id ? (
          game.black?.name ? (
            <div className={styles.playerNameTop}>
              <PersonIcon /> {game.black?.name}
            </div>
          ) : (
            ""
          )
        ) : game.black?.name ? (
          <div className={styles.playerNameTop}>
            <PersonIcon /> {game.black?.name}
          </div>
        ) : (
          <button type="button" onClick={joinAsPlayer} className={styles.playButton}>
            Play as black
          </button>
        )}
        <Board />
        {game.black?.id === session?.user.id ? (
          <div className={styles.playerNameBottom}>
            <PersonIcon /> {session?.user.name}
          </div>
        ) : game.white?.name ? (
          <div className={styles.playerNameBottom}>
            <PersonIcon /> {game.white?.name}
          </div>
        ) : (
          <button type="button" onClick={joinAsPlayer} className={styles.playButton}>
            Play as white
          </button>
        )}
      </div>
      <div className={styles.sidebar}>
        <div className={styles.invite}>
          Invite friends:{" "}
          <span className={styles.copy} onClick={() => handleCopy("link")}>
            ches.su/game/{game.code} <CopyIcon />
          </span>
          <div className={styles.code}>
            or code{" "}
            <span className={styles.copy} onClick={() => handleCopy("code")}>
              {game.code} <CopyIcon />
            </span>
          </div>
        </div>
        <div className={styles.chatbox}>
          <ul className={styles.chatList} ref={chatlistRef}>
            {messages.map((m, i) => (
              <li
                key={i}
                className={
                  !m.author.id && m.author.name === "server"
                    ? styles.server
                    : !m.author.id && m.author.name === "game"
                    ? styles.gameOver
                    : ""
                }
              >
                {m.author.id ? (
                  <span>
                    <span
                      className={
                        m.author.id === game?.white?.id || m.author.id === game?.black?.id
                          ? styles.player
                          : styles.author
                      }
                    >
                      {m.author.name}
                    </span>
                    {": "}
                  </span>
                ) : (
                  ""
                )}
                {m.message}
              </li>
            ))}
          </ul>

          <input
            type="text"
            name="chatbox"
            id="chatbox"
            className={styles.chatInput}
            onKeyUp={chatKeyUp}
            required
          />
        </div>
        <div className={styles.lobby}>
          {game.observers && game.observers.length > 0 ? "Spectators: " : ""}
          <div className={styles.lobbyUsers}>{game.observers?.map((o) => o.name).join(", ")}</div>
        </div>
      </div>
    </div>
  );
};
export default Game;
