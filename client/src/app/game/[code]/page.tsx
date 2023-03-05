import GameWrapper from "@/components/game/GameWrapper";
import { getGame } from "@/lib/game";
import { notFound } from "next/navigation";

export default async function GamePage({ params }: { params: { code: string } }) {
  const game = await getGame(params.code);
  if (!game) {
    notFound();
  }

  return <GameWrapper initialLobby={game} />;
}
