import Game from "@/components/game/Game";
import { getGame } from "@/lib/game";
import { notFound } from "next/navigation";

export default async function GamePage({ params }: { params: { code: string } }) {
  const game = await getGame(params.code);
  if (!game) {
    notFound();
  }

  return <Game initialLobby={game} />;
}
