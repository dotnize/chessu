import PublicGames from "@/components/home/PublicGames";
import JoinGame from "@/components/home/JoinGame";
import CreateGame from "@/components/home/CreateGame";

export default function Home() {
  return (
    <div className="bg-base-200 flex w-full flex-wrap items-center justify-evenly gap-4 rounded-xl px-4 py-10 shadow-md lg:gap-0">
      <PublicGames />

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold leading-tight">Join from invite</h2>
          <JoinGame />
        </div>

        <div className="divider divider-vertical">or</div>

        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold leading-tight">Create game</h2>
          <CreateGame />
        </div>
      </div>
    </div>
  );
}
