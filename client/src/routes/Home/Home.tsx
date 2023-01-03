import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";

import { setGuestSession } from "../../utils/auth";
import { SessionContext } from "../../context/session";
import { createGame, findGame } from "../../utils/games";

const JoinGame = ({ notFound }: { notFound: boolean }) => {
  return (
    <fieldset className={styles.tabContent}>
      {notFound ? <span className={styles.gameNotFound}>Game not found.</span> : ""}
      <label className={styles.label} htmlFor="code">
        Invite code
      </label>
      <input className={styles.input} type="text" id="code" name="code" required />
      <button type="submit" className={styles.submit}>
        Join Game
      </button>
    </fieldset>
  );
};

const CreateGame = () => {
  return (
    <fieldset className={styles.tabContent}>
      <label className={styles.label} htmlFor="side">
        Starting side
      </label>
      <select className={styles.select} name="side" id="side">
        <option value="random">Random</option>
        <option value="white">White</option>
        <option value="black">Black</option>
      </select>
      <button type="submit" className={styles.submit}>
        Create Game
      </button>
    </fieldset>
  );
};

const Home = () => {
  const [creatingGame, setCreatingGame] = useState(false);
  const [gameNotFound, setGameNotFound] = useState(false);
  const session = useContext(SessionContext);
  const navigate = useNavigate();

  async function handleCreateGame(name: string, side: string) {
    const user = await setGuestSession(name);
    if (user) {
      session?.setUser(user);
      const game = await createGame(side);
      if (game) {
        navigate(`/game/${game.code}`);
      } else {
        // TODO error handling
        console.log("handleCreateGame unsuccessful");
      }
    }
  }

  async function handleJoinGame(name: string, code: string) {
    const user = await setGuestSession(name);
    if (user) {
      session?.setUser(user);
      if (code.startsWith("http") || code.startsWith("ches.su")) {
        code = new URL(code).pathname.split("/")[2];
      }
      const game = await findGame(code);
      if (game) {
        navigate(`/game/${game.code}`);
      } else {
        // TODO error handling
        setGameNotFound(true);
      }
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;

    const playerName = (target.elements.namedItem("name") as HTMLInputElement).value;

    if (!playerName) return;

    if (creatingGame) {
      const startingSide = (target.elements.namedItem("side") as HTMLSelectElement).value;
      handleCreateGame(playerName, startingSide);
    } else {
      const gameCode = (target.elements.namedItem("code") as HTMLInputElement).value;
      if (!gameCode) return;
      handleJoinGame(playerName, gameCode);
    }
  }

  return (
    <form className={styles.home} onSubmit={handleSubmit}>
      <fieldset className={styles.name}>
        <label className={styles.label} htmlFor="name">
          Display name
        </label>
        <input
          className={styles.input}
          type="text"
          id="name"
          name="name"
          pattern="[a-zA-Z0-9_-]+"
          title="_ - and alphanumeric characters only"
          defaultValue={session?.user.name}
          required
        />
      </fieldset>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${styles.tabLeft} ${creatingGame ? "" : styles.tabActive}`}
          onClick={() => {
            setCreatingGame(false);
            setGameNotFound(false);
          }}
        >
          Join
        </button>
        <button
          type="button"
          className={`${styles.tab} ${styles.tabRight} ${creatingGame ? styles.tabActive : ""}`}
          onClick={() => setCreatingGame(true)}
        >
          Create
        </button>
      </div>
      {creatingGame ? <CreateGame /> : <JoinGame notFound={gameNotFound} />}
    </form>
  );
};

export default Home;
