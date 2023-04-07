import { fetchPublicGames } from "@/lib/game";
import JoinButton from "./JoinButton";
import RefreshButton from "./RefreshButton";

export default async function PublicGames() {
  const games = await fetchPublicGames();

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2 text-2xl font-bold leading-tight">
        Public games <RefreshButton />
      </h2>

      <div className="bg-base-200 h-80 max-h-80 overflow-y-auto rounded-xl">
        <table className="table-compact lg:table-normal table-zebra table rounded-none">
          <thead>
            <tr>
              <th className="w-48">Host</th>
              <th className="w-48">Opponent</th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            {games && games.length > 0 ? (
              games.map((game) => (
                <tr key={game.code} className="group">
                  <td className={typeof game.host?.id === "number" ? "text-primary" : ""}>
                    {game.host?.name}
                  </td>
                  <td
                    className={
                      typeof (game.host?.id === game.white?.id
                        ? game.black?.id
                        : game.white?.id) === "number"
                        ? "text-primary"
                        : ""
                    }
                  >
                    {(game.host?.id === game.white?.id ? game.black?.name : game.white?.name) || ""}
                  </td>
                  <th>
                    <JoinButton code={game.code as string} />
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td>(empty)</td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
